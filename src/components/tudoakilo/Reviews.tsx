'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import type { ProductData } from '@/app/page'
import { RatingBar } from '@/components/tudoakilo/ui'

export default function Reviews({ product }: { product: ProductData }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 sm:p-6">
      {/* TOP: resumo + barras (mobile stacked igual “loja”) */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        {/* bloco nota */}
        <div className="flex items-start gap-4">
          <div className="text-left md:text-center">
            <div className="text-[40px] sm:text-[44px] font-semibold leading-none">4.9</div>

            <div className="mt-2 flex items-center md:justify-center gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4" fill="#f5b301" stroke="#f5b301" />
              ))}
            </div>

            <div className="mt-1 text-[12px] sm:text-[13px] text-black/60">
              {product.ratingCount} avaliações
            </div>
          </div>

          {/* barras: no mobile ocupa o resto da linha e não estoura */}
          <div className="flex-1 min-w-0 max-w-full md:min-w-[280px]">
            <RatingBar label="5" value={453} total={480} />
            <RatingBar label="4" value={13} total={480} />
            <RatingBar label="3" value={9} total={480} />
            <RatingBar label="2" value={2} total={480} />
            <RatingBar label="1" value={3} total={480} />
          </div>
        </div>
      </div>

      {/* LISTA: no mobile vira “carrossel” horizontal tipo loja */}
      <div className="mt-6 sm:mt-8">
        {/* MOBILE */}
        <div className="sm:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 w-max pb-2">
            {product.reviews.map((r) => (
              <div
                key={r.id}
                className="w-[78vw] max-w-[320px] rounded-2xl border border-black/10 overflow-hidden bg-white shrink-0"
              >
                <div className="relative w-full aspect-[4/5] bg-[#f4efe9]">
                  <Image
                    src={r.image || '/demo/rev-placeholder.jpg'}
                    alt={r.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{r.name}</div>
                    {r.verified ? (
                      <span className="shrink-0 text-[11px] px-2 py-[2px] rounded-full bg-[#eef6ee] text-[#2a7a2a]">
                        verificado
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 flex items-center gap-[2px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < r.rating ? '#f5b301' : 'transparent'}
                        stroke="#f5b301"
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-[12px] text-black/70 leading-relaxed line-clamp-3">
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP/TABLET */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {product.reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-black/10 overflow-hidden bg-white"
            >
              <div className="relative w-full aspect-[4/5] bg-[#f4efe9]">
                <Image
                  src={r.image || '/demo/rev-placeholder.jpg'}
                  alt={r.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{r.name}</div>
                  {r.verified ? (
                    <span className="shrink-0 text-[11px] px-2 py-[2px] rounded-full bg-[#eef6ee] text-[#2a7a2a]">
                      verificado
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < r.rating ? '#f5b301' : 'transparent'}
                      stroke="#f5b301"
                    />
                  ))}
                </div>

                <p className="mt-2 text-[12px] text-black/70 leading-relaxed line-clamp-3">
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* hint “arraste” no mobile */}
      <div className="sm:hidden mt-3 text-[12px] text-black/50 text-center">
        Arraste para ver mais avaliações →
      </div>
    </section>
  )
}
