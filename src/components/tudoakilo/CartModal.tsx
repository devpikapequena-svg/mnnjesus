'use client'

import Image from 'next/image'
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Gift,
  CheckCircle2,
  PackageOpen,
  ArrowRight,
} from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useCart } from '@/context/CartContext'
import { currency } from '@/components/tudoakilo/ui'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify' // Importando o toast

export default function CartModal() {
  const router = useRouter()

  // ⚠️ pega o objeto inteiro pra eu conseguir chamar qualquer função de add
  const cart = useCart() as any
  const { isCartOpen, closeCart, items, inc, dec, remove, total } = cart

  // metas (as suas atuais)
  const FREE_SHIPPING = 97
  const GIFT_TARGET = 156.4

  const isEmpty = items.length === 0

  /* 🔒 trava scroll do fundo */
  useEffect(() => {
    if (!isCartOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isCartOpen])

  const progress = useMemo(() => {
    const pct = Math.min(100, (total / GIFT_TARGET) * 100)
    const freePct = Math.min(100, (FREE_SHIPPING / GIFT_TARGET) * 100)

    // frete sempre desbloqueado (como você pediu)
    const gotFree = true
    const gotGift = total >= GIFT_TARGET

    // barra nunca fica antes do caminhão
    const fillPct = Math.max(pct, freePct)

    // quanto falta pro brinde (isso vira o “52,10” etc)
    const missingGift = Math.max(0, GIFT_TARGET - total)

    return { freePct, fillPct, gotFree, gotGift, missingGift }
  }, [total])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    if (isCartOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isCartOpen, closeCart])

  // ✅ UPSELL: mostra nome curto no card, mas quando adiciona vai com nome completo no carrinho
  function addUpsellBlue() {
    const fullName = 'Pelúcia Menino Jesus que Respira e Acalma a Alma'

    const item = {
      id: 'menino-jesus-azul',
      name: fullName, // ✅ NO CARRINHO vai completo
      variantId: 'azul',
      variantName: 'Azul',
      image: '/azul.png',
      price: progress.missingGift, // ✅ adiciona pelo “valor que falta” (52,10 etc)
      qty: 1,
    }

    const addFn =
      cart?.addToCart ||
      cart?.addItem ||
      cart?.add ||
      cart?.addProduct ||
      cart?.addToBag ||
      cart?.push ||
      cart?.insert

    if (typeof addFn === 'function') {
      try {
        // tenta 1 argumento
        addFn(item)
        return
      } catch {
        // tenta 2 argumentos (alguns contexts usam add(item, qty))
        try {
          addFn(item, 1)
          return
        } catch {}
      }
    }

    console.warn(
      'Nenhuma função de add encontrada no CartContext. Crie algo como addToCart(item) / addItem(item).'
    )
  }

  function goCheckout() {
    closeCart()
    router.push('/checkout')
  }

  // Função para impedir adicionar mais de 4 itens
  function handleIncrement(itemId: string) {
    const currentCartCount = items.reduce((acc: number, it: any) => acc + it.qty, 0)
    if (currentCartCount >= 4) {
      toast.error("Você não pode adicionar mais do que 4 produtos ao carrinho.") // Exibe a notificação de erro
      return
    }
    inc(itemId) // Se a quantidade for menor que 4, permite incrementar
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-[70]">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/45"
        aria-label="Fechar carrinho"
        onClick={closeCart}
        type="button"
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center lg:items-stretch lg:justify-end p-3 sm:p-4">
        <div className="w-full max-w-[430px] lg:max-w-[460px] lg:h-full bg-white rounded-2xl lg:rounded-none lg:rounded-l-2xl shadow-2xl border border-black/10 overflow-hidden">
          {/* header */}
          <div className="px-4 py-4 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f7f3ee] grid place-items-center">
                <ShoppingBag className="w-5 h-5 text-[#6b4a32]" />
              </div>
              <div className="text-[18px] font-semibold text-[#6b4a32]">Carrinho</div>
            </div>

            <button
              className="w-10 h-10 rounded-full hover:bg-black/5 grid place-items-center"
              onClick={closeCart}
              type="button"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-black/70" />
            </button>
          </div>

          {/* content */}
          <div className="px-4 py-4 max-h-[70vh] lg:max-h-none lg:h-[calc(100%-180px)] overflow-auto">
            {isEmpty ? (
              <div className="py-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#f7f3ee] grid place-items-center">
                  <PackageOpen className="w-7 h-7 text-[#6b4a32]" />
                </div>

                <div className="mt-4 text-[16px] font-semibold text-black">
                  Seu carrinho está vazio
                </div>

                <button
                  className="mt-5 w-full h-12 rounded-2xl bg-[#6b4a32] text-white font-semibold inline-flex items-center justify-center gap-2 hover:brightness-95"
                  onClick={closeCart}
                  type="button"
                >
                  Continuar comprando
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* ✅ FRETE E BRINDE EM LINHAS SEPARADAS */}
                <div className="text-center text-[13px] text-black/60">
                  <div className="flex w-full items-center justify-center gap-2 font-semibold text-[#2bb673]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="block">Frete Grátis desbloqueado</span>
                  </div>

                  {progress.gotGift ? (
                    <div className="mt-1 flex w-full items-center justify-center gap-2 font-semibold text-[#2bb673]">
                      <Gift className="w-4 h-4" />
                      <span className="block">Brinde desbloqueado</span>
                    </div>
                  ) : (
                    <div className="mt-1 block">
                      Falta{' '}
                      <span className="font-semibold">{currency(progress.missingGift)}</span> para
                      ganhar um Brinde
                    </div>
                  )}
                </div>

                {/* progress */}
                <div className="mt-5 relative">
                  <div className="h-3 rounded-full bg-[#ececec] overflow-hidden border border-black/10">
                    <div
                      className="h-full transition-all duration-300 ease-out"
                      style={{
                        width: `${progress.fillPct}%`,
                        backgroundImage:
                          'repeating-linear-gradient(135deg, rgba(107,74,50,0.55) 0 7px, rgba(107,74,50,0.15) 7px 14px)',
                      }}
                    />
                  </div>

                  <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${progress.freePct}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2bb673] grid place-items-center -translate-x-1/2 shadow border border-black/10">
                      <Truck className="w-4.5 h-4.5 text-white" />
                    </div>
                  </div>

                  <div className="absolute top-1/2 -translate-y-1/2 right-4">
                    <div
                      className={[
                        'w-8 h-8 rounded-full grid place-items-center translate-x-1/2 shadow border border-black/10',
                        progress.gotGift ? 'bg-[#2bb673]' : 'bg-[#cfcfcf]',
                      ].join(' ')}
                    >
                      <Gift className="w-4.5 h-4.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* itens */}
                <div className="mt-5 space-y-4">
                  {items.map((it: any) => (
                    <div key={it.id} className="flex gap-3 border-b border-black/10 pb-4">
                      <div className="w-[62px] h-[62px] rounded-xl overflow-hidden bg-[#f4efe9] relative shrink-0">
                        <Image src={it.image} alt={it.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-[14px] text-black truncate">
                              {it.name}
                            </div>
                            {it.variantName ? (
                              <div className="text-[13px] text-black/55 truncate">
                                {it.variantName}
                              </div>
                            ) : null}
                          </div>

                          <button
                            onClick={() => remove(it.id)}
                            className="w-8 h-8 rounded-full hover:bg-black/5 grid place-items-center shrink-0"
                            type="button"
                            aria-label="Remover"
                          >
                            <X className="w-4 h-4 text-black/50" />
                          </button>
                        </div>

                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-[14px] text-black/80">{currency(it.price)}</div>
                          <div className="flex items-center gap-2 bg-[#f7f3ee] rounded-full px-2 py-1">
                            <button
                              onClick={() => dec(it.id)}
                              className="w-8 h-8 rounded-full hover:bg-black/5 grid place-items-center"
                              type="button"
                              aria-label="Diminuir"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold">{it.qty}</span>
                            <button
                              onClick={() => handleIncrement(it.id)} // Aqui estamos usando a nova função de incremento
                              className="w-8 h-8 rounded-full hover:bg-black/5 grid place-items-center"
                              type="button"
                              aria-label="Aumentar"
                              disabled={items.reduce((acc: number, it: any) => acc + it.qty, 0) >= 4} // Desabilita o botão se houver 4 itens no carrinho
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ✅ UPSELL FIXO (só aparece se ainda NÃO desbloqueou) */}
                {!progress.gotGift && (
                  <div className="mt-6 rounded-2xl border border-black/10 bg-[#faf7f3] p-4">
                    <div className="text-[13px] font-semibold text-[#6b4a32]">
                      Adicione mais <b>um por {currency(progress.missingGift)}</b> e ganhe um Brinde
                    </div>

                    <div className="mt-3 flex gap-3 items-center">
                      <div className="w-[64px] h-[64px] rounded-xl overflow-hidden bg-white relative border border-black/10 shrink-0">
                        <Image
                          src="/azul.png"
                          alt="Pelúcia Menino Jesus Azul"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* ✅ aqui fica curtinho como você quer */}

                        <div className="mt-1 text-[14px] font-semibold text-black truncate">
                          Pelúcia Menino Jesus
                        </div>

                        <div className="text-[13px] text-black/60">Azul</div>
                      </div>

                      <button
                        className="h-10 px-4 rounded-xl bg-[#6b4a32] text-white text-[13px] font-semibold hover:brightness-95 shrink-0"
                        onClick={addUpsellBlue}
                        type="button"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* footer */}
          {!isEmpty && (
            <div className="px-4 py-4 border-t border-black/10">
              <div className="flex justify-between font-semibold text-[#6b4a32]">
                <span>Total:</span>
                <span>{currency(total)}</span>
              </div>

              <button
                className="mt-3 w-full h-12 rounded-2xl bg-[#6b4a32] text-white font-semibold hover:brightness-95"
                type="button"
                onClick={goCheckout}
              >
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
