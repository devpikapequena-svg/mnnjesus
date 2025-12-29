'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePayment } from '@/context/PaymentContext'
import { currency } from '@/components/tudoakilo/ui'
import { Lock, Copy, Check } from 'lucide-react'

function formatMMSS(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function PagamentoPage() {
  const router = useRouter()
  const { pix, clearPix } = usePayment()

  const [pageMounted, setPageMounted] = useState(false)
  useEffect(() => setPageMounted(true), [])

  const [copied, setCopied] = useState(false)

  // ===== Expiração =====
  const EXPIRY_MS = 10 * 60 * 1000 // fallback 10 min
  const orderId = useMemo(() => pix?.externalId || pix?.txid || '', [pix])

  const pixCode = useMemo(() => pix?.copyPaste || pix?.qrCode || '', [pix])
  const amount = useMemo(() => Number(pix?.amount || 0), [pix])

  const pixImageSrc = useMemo(() => {
    const base = pix?.qrCodeBase64
    if (!base) return ''
    if (base.startsWith('data:')) return base
    return `data:image/png;base64,${base}`
  }, [pix])

  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null)
  const [remainingMs, setRemainingMs] = useState<number>(0)

  const isExpired = !!expiresAtMs && remainingMs <= 0
  const mmss = expiresAtMs ? formatMMSS(remainingMs) : '10:00'

  // Se entrar direto sem pix => volta pro checkout
  useEffect(() => {
    if (!pageMounted) return
    if (pix) return
    router.replace('/checkout')
  }, [pageMounted, pix, router])

  // Define expiresAtMs (prioriza backend, senão fallback persistido)
  useEffect(() => {
    if (!pix) return

    if (pix.expiresAt) {
      const parsed = new Date(pix.expiresAt).getTime()
      if (!Number.isNaN(parsed)) {
        setExpiresAtMs(parsed)
        setRemainingMs(Math.max(0, parsed - Date.now()))
        return
      }
    }

    const storageKey = `pix_expiresAt_${orderId || 'no_order'}`
    const saved = sessionStorage.getItem(storageKey)

    let exp = saved ? Number(saved) : NaN
    if (!saved || Number.isNaN(exp)) {
      exp = Date.now() + EXPIRY_MS
      sessionStorage.setItem(storageKey, String(exp))
    }

    setExpiresAtMs(exp)
    setRemainingMs(Math.max(0, exp - Date.now()))
  }, [pix, orderId])

  // Countdown
  useEffect(() => {
    if (!expiresAtMs) return
    const tick = () => setRemainingMs(Math.max(0, expiresAtMs - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [expiresAtMs])

  // Expirou => limpa e volta
  useEffect(() => {
    if (!expiresAtMs) return
    if (Date.now() < expiresAtMs) return
    try {
      sessionStorage.removeItem(`pix_expiresAt_${orderId || 'no_order'}`)
    } catch {}
    clearPix()
    router.replace('/checkout')
  }, [expiresAtMs, orderId, clearPix, router])

  // Checar status e ir pra /sucesso
  useEffect(() => {
    if (!pageMounted) return
    if (!pix) return
    if (!orderId) return
    if (isExpired) return

    let alive = true
    let intervalId: number | null = null

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/create-payment?externalId=${encodeURIComponent(orderId)}`,
          { cache: 'no-store' }
        )
        const data = await res.json().catch(() => ({}))
        const status = String((data as any)?.status || '').toUpperCase()

        if (status === 'PAID' || status === 'APPROVED') {
          if (!alive) return

          try {
            sessionStorage.removeItem(`pix_expiresAt_${orderId || 'no_order'}`)
          } catch {}

          clearPix()
          router.replace('/checkout/sucesso')
        }
      } catch {
        // ignora
      }
    }

    checkStatus()
    intervalId = window.setInterval(checkStatus, 3000)

    return () => {
      alive = false
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [pageMounted, pix, orderId, isExpired, clearPix, router])

  async function copyPix() {
    if (!pixCode || isExpired) return
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = pixCode
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {}
    }
  }

  if (!pix) return null

  if (!pixCode && !pixImageSrc) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#f6f2ec] px-6 text-center">
        <div className="text-[14px] font-extrabold text-red-700">
          Dados do Pix não encontrados.
        </div>
        <button
          onClick={() => {
            clearPix()
            router.replace('/checkout')
          }}
          className="mt-4 h-12 px-5 rounded-xl bg-[#6b4a32] text-white font-extrabold text-[13px]"
        >
          Voltar ao checkout
        </button>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f2ec] text-[#1b1b1b]">
      {/* header igual (logo + cadeado) */}
      <div className="bg-white border-b border-black/10">
        <div className="mx-auto w-full max-w-[980px] px-3 sm:px-4 h-14 flex items-center justify-center relative">
          <div className="relative h-7 w-[140px]">
            <Image
              src="/lg02.svg"
              alt="TUDOAKILO"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
            <div className="w-9 h-9 rounded-xl border border-black/10 bg-white grid place-items-center">
              <Lock className="w-4.5 h-4.5 text-black/70" />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[980px] px-3 sm:px-4 py-6">
        <div className="text-center">
          <div className="text-[36px] sm:text-[44px] font-extrabold text-[#6b4a32]">
            Quase lá...
          </div>

          <div className="mt-2 text-[16px] sm:text-[18px] text-black/70">
            Pague seu Pix dentro de <b>{mmss}</b> para garantir sua compra.
          </div>

          <div
            className={[
              'mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold',
              isExpired
                ? 'bg-red-100 text-red-700'
                : 'bg-[#fff7c2] text-[#7a6a2a]',
            ].join(' ')}
          >
            {isExpired ? 'Pix expirado' : 'Aguardando pagamento'}{' '}
            {!isExpired ? <span className="tracking-[3px]">•••</span> : null}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
          <div className="text-center text-[18px] text-black/70">
            Valor do Pix:{' '}
            <span className="text-[#2bb673] font-extrabold">
              {currency(amount)}
            </span>
          </div>

          {/* ✅ QR: não aparece no mobile */}
          {pixImageSrc ? (
            <div className="mt-5 hidden sm:flex justify-center">
              <img
                src={pixImageSrc}
                alt="QR Code Pix"
                className="h-[220px] w-[220px] rounded-2xl border border-black/10 bg-white p-2"
                draggable={false}
                loading="lazy"
              />
            </div>
          ) : null}

          <button
            className="mt-4 w-full h-14 rounded-2xl bg-[#6b4a32] text-white font-extrabold text-[16px] hover:brightness-95 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
            onClick={copyPix}
            disabled={isExpired || !pixCode}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {isExpired ? 'Pix expirado' : copied ? 'Código copiado' : 'Copiar código'}
          </button>

          <div className="mt-8 text-[30px] sm:text-[36px] font-extrabold text-[#6b4a32] text-center">
            COMO PAGAR SEU PIX
          </div>

          {/* ✅ steps sem ícone do relógio */}
          <div className="mt-6 space-y-5">
            <HowStep n="1" text="Clique no botão acima para copiar o CÓDIGO PIX gerado." />
            <HowStep
              n="2"
              text='No aplicativo do seu banco, clique em PIX e procure a opção "COPIA E COLA".'
            />
            <HowStep n="3" text="Cole o CÓDIGO PIX copiado acima e confirme para aprovar sua compra!" />
          </div>

          {isExpired ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-50 p-4 text-center">
              <div className="text-[13px] font-extrabold text-red-700">
                Seu Pix expirou. Volte ao checkout para gerar novamente.
              </div>
              <button
                onClick={() => {
                  try {
                    sessionStorage.removeItem(`pix_expiresAt_${orderId || 'no_order'}`)
                  } catch {}
                  clearPix()
                  router.replace('/checkout')
                }}
                className="mt-4 h-12 px-5 rounded-xl bg-[#6b4a32] text-white font-extrabold text-[13px]"
              >
                Voltar ao checkout
              </button>
            </div>
          ) : null}
        </div>
      </main>

     {/* ✅ FOOTER full width (fora do main) */}
<footer className="mt-10 bg-[#bda68e] w-full">
  <div className="mx-auto w-full max-w-[980px] px-4 py-10 text-center text-white">
    <div className="text-[13px] sm:text-[14px] font-semibold underline">
      Formas de pagamento
    </div>

    <div className="mt-3 text-[13px] sm:text-[14px] font-semibold underline">
      Informações de contato
    </div>

    <div className="mt-5 text-[12px] sm:text-[13px] font-semibold text-white/85">
      tudoakilo
    </div>
  </div>
</footer>

    </div>
  )
}

function HowStep({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 text-[15px] text-black/75 leading-relaxed">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#bda68e] text-white font-extrabold text-[14px] mr-2">
          {n}
        </span>
        {text}
      </div>
    </div>
  )
}
