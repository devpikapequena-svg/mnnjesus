'use client'

import { Gift, Percent, Star, Truck } from 'lucide-react'
import type { ProductData } from '@/app/page'
import { currency } from '@/components/tudoakilo/ui'
import { useCart } from '@/context/CartContext'


function imageForVariant(variantId: string) {
  if (variantId === 'vermelho') return '/5thumb.png'
  if (variantId === 'azul') return '/6thumb.png'
  return '/7thumb.png'
}

export default function BuyBox({
  product,
  activeVariant,
  setActiveVariant,
  qty,
}: {
  product: ProductData
  activeVariant: string
  setActiveVariant: (id: string) => void
  qty: number
  setQty: (n: number) => void
}) {
  const { addItem } = useCart()

  const activeVariantObj = product.variants.find((v) => v.id === activeVariant)
  const economiza = product.price

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* BADGES */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.badges.map((b) => (
            <span
              key={b}
              className={[
                'text-[11px] font-semibold px-2 py-1 rounded-lg leading-none',
                b.includes('VENDIDO') ? 'bg-[#ff7a00] text-white' : 'bg-[#2f80ed] text-white',
              ].join(' ')}
            >
              {b}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h1 className="mt-3 text-[20px] leading-snug font-semibold text-black">{product.name}</h1>

        {/* RATING */}
        <div className="mt-2 flex items-center gap-2 text-[13px] text-black/70">
          <div className="flex items-center gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4" fill="#f5b301" stroke="#f5b301" />
            ))}
          </div>
          <span className="font-semibold text-black">{product.rating}</span>
          <span>({product.ratingCount} Avaliações)</span>
        </div>

        {/* CASHBACK */}
        <div className="mt-3 inline-flex items-center gap-2 text-[12px] text-[#6b4a32] px-3 py-2 rounded-xl bg-[#faf7f3]">
          <Percent className="w-4 h-4" />
          <span className="font-medium">{product.cashbackLabel}</span>
        </div>

        {/* PRICE */}
        <div className="mt-2">
          <div className="flex items-end gap-2 flex-wrap">
            <div className="text-[27px] text-[#6b4a32]">{currency(product.price)}</div>
            <div className="text-[17px] text-[#b08c6a] line-through">{currency(product.oldPrice)}</div>
            <span className="text-[12px] bg-[#b08c6a] text-white px-2 py-1 rounded-md leading-none">
              -85%
            </span>
          </div>
        </div>

        {/* VARIANT */}
        <div className="mt-5">
          <div className="text-[13px] text-black/70">
            Cor: <span className="font-semibold text-black">{activeVariantObj?.name}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {product.variants.map((v) => {
              const active = v.id === activeVariant
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v.id)}
                  className={[
                    'w-12 h-12 rounded-xl border overflow-hidden bg-white relative',
                    active
                      ? 'border-[#6b4a32] ring-2 ring-[#6b4a32]/20'
                      : 'border-black/10 hover:border-black/20',
                  ].join(' ')}
                  aria-label={`Selecionar ${v.name}`}
                  title={v.name}
                  type="button"
                >
                  <div className="absolute inset-0">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${v.thumb})` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            const v = product.variants.find((x) => x.id === activeVariant)
            addItem(
              {
                id: `menino-jesus-${activeVariant}`,
                name: product.name,
                variantName: v?.name,
                price: product.price,
                image: imageForVariant(activeVariant),
              },
              qty
            )
          }}
          className="mt-6 w-full h-12 rounded-2xl bg-[#6b4a32] text-white font-semibold text-[14px] hover:brightness-95 transition"
          type="button"
        >
          Adicionar ao Carrinho
        </button>

        {/* STOCK (igual print) */}
        <div className="mt-5">
          <div className="text-[13px] text-black/70 text-center">
            Últimas{' '}
            <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-2 rounded-full bg-[#efe7dd] text-[#6b4a32] font-semibold text-[12px]">
              4
            </span>{' '}
            unidades em estoque:
          </div>

          <div className="mt-3 mx-auto w-full max-w-[420px] h-[12px] rounded-full bg-[#e7e7e7] border border-black/10 overflow-hidden">
            <div
              className="h-full w-[14%] rounded-full"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(107,74,50,0.55) 0 7px, rgba(107,74,50,0.15) 7px 14px)',
              }}
            />
          </div>
        </div>

        {/* BENEFÍCIOS */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#faf7f3] p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white grid place-items-center text-[#6b4a32] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-black leading-tight">Frete Grátis</div>
                <div className="mt-[2px] text-[12px] text-black/60 leading-snug">
                  Em todos os pedidos acima de R$ 90
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#faf7f3] p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white grid place-items-center text-[#6b4a32] shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-black leading-tight">Brinde Especial</div>
                <div className="mt-[2px] text-[12px] text-black/60 leading-snug">
                  Em todos os pedidos acima de R$ 400
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
