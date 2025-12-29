'use client'

import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { usePayment } from '@/context/PaymentContext'
import { currency } from '@/components/tudoakilo/ui'
import {
  Lock,
  BadgePercent,
  ChevronRight,
  Pencil,
  Trash2,
} from 'lucide-react'

type Step = 1 | 2 | 3

type Address = {
  cep: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement: string
  recipient: string
}

function onlyDigits(v: string) {
  return v.replace(/\D/g, '')
}

function formatCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function formatCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11)
  const p1 = d.slice(0, 3)
  const p2 = d.slice(3, 6)
  const p3 = d.slice(6, 9)
  const p4 = d.slice(9, 11)
  let out = p1
  if (p2) out += '.' + p2
  if (p3) out += '.' + p3
  if (p4) out += '-' + p4
  return out
}

function formatPhoneBR(v: string) {
  const d = onlyDigits(v).slice(0, 11)
  const a = d.slice(0, 2)
  const b = d.slice(2, 7)
  const c = d.slice(7, 11)
  if (!a) return ''
  if (d.length <= 2) return `(${a}`
  if (d.length <= 7) return `(${a}) ${d.slice(2)}`
  return `(${a}) ${b}-${c}`
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function isValidCPF(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw)
  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  const calc = (base: string, factor: number) => {
    let total = 0
    for (let i = 0; i < base.length; i++) total += Number(base[i]) * (factor - i)
    const mod = (total * 10) % 11
    return mod === 10 ? 0 : mod
  }

  const d1 = calc(cpf.slice(0, 9), 10)
  const d2 = calc(cpf.slice(0, 10), 11)
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10])
}

function getUtmQuery() {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  ;[
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'src',
    'sck',
    'fbclid',
    'gclid',
    'ttclid',
  ].forEach((k) => {
    const v = p.get(k)
    if (v) out[k] = v
  })
  return out
}

function LoadingModal({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="w-80 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-10 w-10 animate-spin text-[#2bb673]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>

          <p className="text-center text-[15px] font-extrabold text-black/90">
            Gerando seu Pix...
          </p>
          <p className="text-center text-[12px] text-black/50">
            Por favor, aguarde...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { setPix } = usePayment()
  const { items, total } = useCart() as any

  const itemsCount =
    items?.reduce((acc: number, it: any) => acc + (it.qty ?? 1), 0) ?? 0

  const [step, setStep] = useState<Step>(1)

  // ✅ REGRA FRETE GRÁTIS
  const FREE_SHIPPING = 49.90
  const gotFreeShipping = total >= FREE_SHIPPING

  // ====== TIMER (topbar marrom)
  const [offerSeconds, setOfferSeconds] = useState(9 * 60 + 9)
  useEffect(() => {
    const t = setInterval(() => {
      setOfferSeconds((s) => (s <= 0 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const offerMMSS = useMemo(() => {
    const m = Math.floor(offerSeconds / 60)
    const s = offerSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [offerSeconds])

  // ====== PROGRESSO BRINDE
  const GIFT_TARGET = 82.8
  const missingGift = Math.max(0, GIFT_TARGET - total)
  const giftPct = Math.min(100, (total / GIFT_TARGET) * 100)

  // ====== FORM IDENTIFICAÇÃO
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')

  const [touched1, setTouched1] = useState(false)

  const errorsStep1 = useMemo(() => {
    const e: Record<string, string> = {}
    if (!fullName.trim()) e.fullName = 'Informe seu nome.'
    if (!email.trim()) e.email = 'Informe seu e-mail.'
    else if (!isValidEmail(email)) e.email = 'E-mail inválido.'
    if (!cpf.trim()) e.cpf = 'Informe seu CPF.'
    else if (!isValidCPF(cpf)) e.cpf = 'CPF inválido.'
    if (!phone.trim()) e.phone = 'Informe seu WhatsApp/Celular.'
    else if (onlyDigits(phone).length < 10) e.phone = 'Número inválido.'
    return e
  }, [fullName, email, cpf, phone])

  const canGoStep2 = Object.keys(errorsStep1).length === 0

  // ====== FORM ENTREGA
  const [cep, setCep] = useState('')
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string>('')

  const [addressUnlocked, setAddressUnlocked] = useState(false)

  const [addr, setAddr] = useState<Address>({
    cep: '',
    uf: '',
    city: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    recipient: '',
  })

  const [touched2, setTouched2] = useState(false)

  function updateAddr<K extends keyof Address>(key: K, value: Address[K]) {
    setAddr((prev) => ({ ...prev, [key]: value }))
  }

  async function lookupCep(raw: string) {
    const digits = onlyDigits(raw)
    if (digits.length !== 8) return

    setCepLoading(true)
    setCepError('')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()

      if (data?.erro) {
        setCepError('CEP não encontrado.')
        setAddressUnlocked(false)
        return
      }

      const street = data?.logradouro ?? ''
      const neighborhood = data?.bairro ?? ''
      const city = data?.localidade ?? ''
      const uf = data?.uf ?? ''

      setAddr((prev) => ({
        ...prev,
        cep: formatCEP(digits),
        street,
        neighborhood,
        city,
        uf,
      }))
      setAddressUnlocked(true)
    } catch {
      setCepError('Não foi possível buscar o CEP.')
      setAddressUnlocked(false)
    } finally {
      setCepLoading(false)
    }
  }

  const errorsStep2 = useMemo(() => {
    const e: Record<string, string> = {}

    if (!addressUnlocked) {
      if (onlyDigits(cep).length !== 8) e.cep = 'Informe um CEP válido.'
      if (cepError) e.cep = cepError
      return e
    }

    if (!addr.cep.trim()) e.cep = 'Informe o CEP.'
    if (!addr.street.trim()) e.street = 'Informe o endereço.'
    if (!addr.number.trim()) e.number = 'Informe o número.'
    if (!addr.neighborhood.trim()) e.neighborhood = 'Informe o bairro.'
    if (!addr.recipient.trim()) e.recipient = 'Informe o destinatário.'

    return e
  }, [addressUnlocked, cep, cepError, addr])

  const canGoStep3 = Object.keys(errorsStep2).length === 0

  // ====== STEP 3 (endereço salvo + frete)
  const [savedAddress, setSavedAddress] = useState<Address | null>(null)
  const [shippingSelected, setShippingSelected] = useState<'priority'>('priority')

  // ✅ valor do frete (vira 0 se desbloqueou)
  const SHIPPING_PRICE = gotFreeShipping ? 0 : 19.74

  // ✅ pagamento
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')

  function goToEntrega() {
    setTouched1(true)
    if (!canGoStep2) return
    setStep(2)
  }

  async function continueEntrega() {
    setTouched2(true)
    if (!canGoStep3) return

    const finalAddr: Address = {
      ...addr,
      cep: addr.cep || formatCEP(cep),
    }
    setSavedAddress(finalAddr)
    setStep(3)
  }

  async function handlePay() {
    setPayError('')

    // validações finais
    if (!fullName.trim() || !email.trim() || !cpf.trim() || !phone.trim()) {
      setPayError('Preencha seus dados antes de continuar.')
      setStep(1)
      return
    }
    if (!savedAddress) {
      setPayError('Selecione um endereço antes de continuar.')
      setStep(2)
      return
    }

    setPayLoading(true)

    try {
      // monta itens do carrinho
      const checkoutItems =
        (items ?? []).map((it: any) => {
          const qty = Number(it?.qty ?? 1) || 1
          const unit =
            typeof it?.unitPrice === 'number'
              ? it.unitPrice
              : typeof it?.price === 'number'
              ? it.price
              : typeof it?.price === 'string'
              ? Number(
                  String(it.price)
                    .replace(/\./g, '')
                    .replace(',', '.')
                    .replace(/[^\d.]/g, '')
                ) || 0
              : 0

          return {
            id: String(it?.id ?? it?.sku ?? it?.slug ?? it?.title ?? `item_${Math.random()}`),
            title: String(it?.title ?? it?.name ?? 'Item'),
            unitPrice: unit,
            quantity: qty,
            slug: String(it?.slug ?? it?.id ?? ''),
          }
        }) ?? []

      const amountFinal = Number(total) + Number(SHIPPING_PRICE)

      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        phone: onlyDigits(phone),
        cpf: onlyDigits(cpf),

        // entrega
        cep: onlyDigits(savedAddress.cep),
        address: savedAddress.street,
        number: savedAddress.number,
        neighborhood: savedAddress.neighborhood,
        reference: savedAddress.complement || '',

        amount: amountFinal,
        items: checkoutItems,
        externalId: `order_${Date.now()}`,
        utmQuery: getUtmQuery(),
        deliveryOption: 'PIX',

        // extras úteis
        shippingPrice: Number(SHIPPING_PRICE),
        shipping: shippingSelected,
        city: savedAddress.city,
        uf: savedAddress.uf,
        recipient: savedAddress.recipient,
      }

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error((data as any)?.error || 'Erro ao processar pagamento.')
      }

      const payment = (data as any)?.data ?? data
      const expiresAt =
        payment?.pix?.expires_at
          ? String(payment.pix.expires_at)
          : new Date(Date.now() + 10 * 60 * 1000).toISOString()

      setPix({
        externalId: payment?.id || payload.externalId,
        amount: (payment?.total_amount ?? Math.round(amountFinal * 100)) / 100,
        copyPaste: payment?.pix?.code || '',
        qrCodeBase64: payment?.pix?.qrcode_base64 || '',
        txid: payment?.id || payload.externalId,
        expiresAt,
      })

      router.push('/checkout/pagamento')
    } catch (err: any) {
      setPayError(err?.message || 'Erro ao gerar Pix.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setPayLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white text-[#1b1b1b]">
        {/* HEADER */}
        <div className="sticky top-0 z-50 bg-white border-b border-black/10">
          <div className="mx-auto w-full max-w-[980px] h-[64px] px-4 flex items-center justify-center relative">
            <Image src="/lg02.svg" alt="TUDOAKILO" width={160} height={34} priority />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-9 h-9 rounded-full border border-black/10 bg-white grid place-items-center">
                <Lock className="w-4.5 h-4.5 text-black/70" />
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto w-full max-w-[980px] px-4 py-4">
          {/* ERRO PIX */}
          {payError ? (
            <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">
              {payError}
            </div>
          ) : null}

          {/* RESUMO */}
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-bold text-[#6b4a32]">
              Resumo ({itemsCount})
            </div>
            <div className="inline-flex items-center gap-2 text-[#6b4a32] font-bold">
              <span>{currency(total)}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

     {/* PROGRESSO BRINDE */}
<div className="mt-4">
  <div className="text-[14px] text-black/75">
    {missingGift > 0 ? (
      <>
        Adicione <b>{currency(missingGift)}</b> e ganhe um brinde!
      </>
    ) : (
      <>
        Você ganhou um brinde! Ele será incluso no seu pedido.
      </>
    )}
  </div>

  <div className="mt-2 h-[10px] rounded-full bg-black/10 overflow-hidden">
    <div
      className="h-full bg-[#2bb673] transition-all"
      style={{ width: `${giftPct}%` }}
    />
  </div>
</div>


          {/* CASHBACK */}
          <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f6f2ec] grid place-items-center">
              <BadgePercent className="w-5 h-5 text-[#2bb673]" />
            </div>
            <div className="text-[14px]">
              <span className="text-[#2bb673] font-bold">20%</span>{' '}
              <span className="text-black/70">
                de cashback para a próxima compra
              </span>
            </div>
          </div>

          {/* CARD PRINCIPAL */}
          <div className="mt-5 rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
            {step === 1 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-[24px] font-extrabold text-[#6b4a32]">
                    Identificação
                  </div>
                  <div className="text-black/35 font-bold">1 de 3</div>
                </div>

                <div className="mt-4 space-y-3">
                  <Field
                    label="Nome completo"
                    value={fullName}
                    onChange={setFullName}
                    error={touched1 ? errorsStep1.fullName : ''}
                  />
                  <Field
                    label="E-mail"
                    value={email}
                    onChange={setEmail}
                    inputMode="email"
                    error={touched1 ? errorsStep1.email : ''}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="CPF"
                      value={cpf}
                      onChange={(v) => setCpf(formatCPF(v))}
                      inputMode="numeric"
                      error={touched1 ? errorsStep1.cpf : ''}
                    />
                    <Field
                      label="WhatsApp/Celular"
                      value={phone}
                      onChange={(v) => setPhone(formatPhoneBR(v))}
                      inputMode="tel"
                      error={touched1 ? errorsStep1.phone : ''}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-black/10 bg-[#f6f6f6] px-4 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-black/10 grid place-items-center">
                    <BadgePercent className="w-5 h-5 text-black/60" />
                  </div>
                  <div className="text-[14px] text-black/70">
                    Você ganhou{' '}
                    <span className="text-[#2bb673] font-bold">
                      3% de desconto
                    </span>{' '}
                    pagando com Pix
                  </div>
                </div>

                <button
                  className="mt-5 w-full h-14 rounded-2xl bg-[#5b3f2a] text-white font-extrabold text-[16px] hover:brightness-95"
                  type="button"
                  onClick={goToEntrega}
                >
                  Ir para Entrega
                </button>

                <div className="mt-3 text-center text-[13px] text-black/40">
                  Ao prosseguir com a compra, você concorda com as{' '}
                  <span className="underline font-bold">
                    Políticas de Privacidade
                  </span>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-[24px] font-extrabold text-[#6b4a32]">
                    Entrega
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-[#6b4a32] font-bold text-[14px]"
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </button>
                    <div className="text-black/35 font-bold">2 de 3</div>
                  </div>
                </div>

          {/* ===== STEP 2: ENTREGA ===== */}
<div className="mt-4">
  {/* ✅ CEP menor + Cidade/UF ao lado (só aparece após buscar) */}
  <div className="flex items-start gap-3">
    {/* CEP */}
    <div className="flex-1 max-w-[220px]">
      <div
        className={[
          'relative w-full rounded-2xl border bg-white',
          touched2 && errorsStep2.cep ? 'border-red-500/60' : 'border-black/15',
        ].join(' ')}
      >
        <div className="absolute left-4 top-2 text-[11px] font-semibold text-black/45">
          CEP
        </div>

        {cepLoading ? (
          <div className="absolute right-4 top-2 text-[11px] font-semibold text-black/45">
            Buscando...
          </div>
        ) : null}

        <input
          value={cep}
          onChange={(e) => {
            const f = formatCEP(e.target.value)
            setCep(f)
            setCepError('')
            if (onlyDigits(f).length === 8) lookupCep(f)
            else setAddressUnlocked(false)
          }}
          inputMode="numeric"
          className="w-full h-12 rounded-2xl bg-transparent px-3 pt-4 text-[13px] text-black outline-none"
        />
      </div>

      {touched2 && errorsStep2.cep ? (
        <div className="mt-1 text-[12px] text-red-600">{errorsStep2.cep}</div>
      ) : null}
    </div>

    {/* ✅ Cidade/UF + status (texto, sem input) */}
    {addressUnlocked ? (
      <div className="flex-2 pt-[4px]">
        <div className="text-[12px] font-extrabold text-black/75 leading-tight">
          {addr.city} / {addr.uf}
        </div>
        <div className="mt-1 text-[13px] font-extrabold text-[#2bb673] leading-tight">
          Envio Prioritário! ✓
        </div>
      </div>
    ) : null}
  </div>
</div>

{addressUnlocked ? (
  <>
    {/* ✅ resto do formulário liberado */}
    <div className="mt-4 space-y-3">
      <Field
        label="Endereço"
        value={addr.street}
        onChange={(v) => updateAddr('street', v)}
        error={touched2 ? errorsStep2.street : ''}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Número"
          value={addr.number}
          onChange={(v) => updateAddr('number', v)}
          inputMode="numeric"
          error={touched2 ? errorsStep2.number : ''}
        />
        <Field
          label="Bairro"
          value={addr.neighborhood}
          onChange={(v) => updateAddr('neighborhood', v)}
          error={touched2 ? errorsStep2.neighborhood : ''}
        />
      </div>

      <Field
        label="Complemento (opcional)"
        value={addr.complement}
        onChange={(v) => updateAddr('complement', v)}
      />

      <Field
        label="Destinatário"
        value={addr.recipient}
        onChange={(v) => updateAddr('recipient', v)}
        error={touched2 ? errorsStep2.recipient : ''}
      />
    </div>

    <button
      className="mt-5 w-full h-14 rounded-2xl bg-[#5b3f2a] text-white font-extrabold text-[16px] hover:brightness-95"
      type="button"
      onClick={continueEntrega}
    >
      Continuar
    </button>
  </>
) : null}
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-[24px] font-extrabold text-[#6b4a32]">
                    Entrega
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-[#6b4a32] font-bold text-[14px]"
                      type="button"
                      onClick={() => setStep(2)}
                    >
                      Voltar
                    </button>
                    <div className="text-black/35 font-bold">2 de 3</div>
                  </div>
                </div>

                <div className="mt-4 text-[#6b4a32] font-bold">+ Novo endereço</div>

                {savedAddress ? (
                  <div className="mt-3 rounded-2xl border-2 border-[#2bb673] bg-white px-4 py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <div className="font-extrabold text-[14px] text-black/80">
                          {savedAddress.street}, {savedAddress.number} -{' '}
                          {savedAddress.neighborhood}
                        </div>
                        <div className="mt-1 text-[13px] text-black/60">
                          {savedAddress.city}-{savedAddress.uf} | CEP{' '}
                          {savedAddress.cep}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-black/45">
                      <button
                        className="flex flex-col items-center text-[12px] font-bold hover:text-black/70"
                        type="button"
                        onClick={() => setStep(2)}
                      >
                        <Pencil className="w-5 h-5" />
                        Editar
                      </button>
                      <button
                        className="flex flex-col items-center text-[12px] font-bold hover:text-black/70"
                        type="button"
                        onClick={() => {
                          setSavedAddress(null)
                          setStep(2)
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                        Excluir
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 text-[18px] font-extrabold text-black/70">
                  Escolha uma forma de entrega:
                </div>

                <button
                  className="mt-3 w-full rounded-2xl border-2 border-[#5b3f2a] bg-white px-4 py-4 flex items-center justify-between"
                  type="button"
                  onClick={() => setShippingSelected('priority')}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-black/70 grid place-items-center">
                      <div className="w-3 h-3 rounded-full bg-black/70" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-[15px] text-black/80">
                        {gotFreeShipping
                          ? 'Frete Grátis · Envio Prioritário'
                          : 'Envio Prioritário · De 4 a 9 dias'}
                      </div>
                      <div className="text-[13px] text-black/55">
                        Entrega garantida
                      </div>
                    </div>
                  </div>

                  <div className="font-extrabold text-[#2bb673]">
                    {currency(SHIPPING_PRICE)}
                  </div>
                </button>

                <div className="mt-5 text-[14px] leading-relaxed text-black/55">
                  Frete com seguro de entrega e{' '}
                  <b className="text-black/70">código de rastreio</b>, que será
                  enviado via <b className="text-black/70">WhatsApp e e-mail</b>{' '}
                  após o pedido ser despachado.
                  <br />
                  <br />
                  Você poderá entrar em contato com o nosso suporte sempre que
                  precisar. Atendimento rápido e humanizado.
                  <br />
                  <br />
                  Pedidos despachados entre 24 e 96 horas úteis.
                </div>

                {/* ✅ AGORA GERA PIX E VAI PRA /checkout/pagamento */}
                <button
                  className="mt-6 w-full h-14 rounded-2xl bg-[#5b3f2a] text-white font-extrabold text-[16px] hover:brightness-95 disabled:opacity-70"
                  type="button"
                  onClick={handlePay}
                  disabled={payLoading}
                >
                  {payLoading ? 'Gerando Pix...' : 'Ir para Pagamento'}
                </button>
              </>
            )}
          </div>

          {/* Antes do footer (cards + bolinhas) */}
          <div className="mt-6 border-t border-black/5 pt-6">
            <div className="flex gap-3 overflow-hidden">
              <ReviewCard
                name="Fabiana Marques"
                text="É tão real que arrepia. Quando ele respira, o quarto fica em paz. Foi o presente mais especial que dei pra minha filha."
                img="/review1.jpg"
              />
              <ReviewCard
                name="Luciana A."
                text="Meu filho amou. O som da respiração é muito relaxante."
                img="/review2.png"
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#5b3f2a]" />
              <span className="w-2 h-2 rounded-full bg-black/15" />
              <span className="w-2 h-2 rounded-full bg-black/15" />
            </div>
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

      <LoadingModal isOpen={payLoading} />
    </>
  )
}

function Field({
  label,
  value,
  onChange,
  error,
  inputMode,
  rightHint,
  rightHintStrong,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  rightHint?: string
  rightHintStrong?: boolean
}) {
  return (
    <div>
      <div
        className={[
          'relative w-full rounded-2xl border bg-white',
          error ? 'border-red-500/60' : 'border-black/15',
        ].join(' ')}
      >
        <div className="absolute left-4 top-2 text-[11px] font-semibold text-black/45">
          {label}
        </div>

        {rightHint ? (
          <div
            className={[
              'absolute right-4 top-2 text-[11px] font-semibold',
              rightHintStrong ? 'text-[#2bb673]' : 'text-black/45',
            ].join(' ')}
          >
            {rightHint}
          </div>
        ) : null}

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={inputMode}
          className="w-full h-12 rounded-2xl bg-transparent px-3 pt-4 text-[13px] text-black outline-none"
        />
      </div>

      {error ? (
        <div className="mt-1 text-[12px] text-red-600">{error}</div>
      ) : null}
    </div>
  )
}

function ReviewCard({
  name,
  text,
  img,
}: {
  name: string
  text: string
  img: string
}) {
  return (
    <div className="min-w-[280px] w-[280px] rounded-2xl border border-black/5 bg-[#f5f5f5] p-4">
      <div className="flex items-center justify-between">
        <div className="font-extrabold text-[13px] text-black/60">{name}</div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-black/10 relative">
          <Image src={img} alt={name} fill className="object-cover" />
        </div>
      </div>
      <div className="mt-3 text-[14px] leading-relaxed text-black/60">
        {text}
      </div>
    </div>
  )
}
