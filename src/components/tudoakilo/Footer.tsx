'use client'

import { Facebook, Instagram, ArrowRight } from 'lucide-react'

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[14px] font-semibold tracking-wide">{title}</div>
      <ul className="mt-4 space-y-2 text-[13px] text-white/90">
        {items.map((it) => (
          <li key={it}>
            <a
              href="#"
              className="hover:text-white underline-offset-4 hover:underline"
            >
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      className="
        mt-10 w-full bg-[#b1967d] text-white
        mb-[calc(72px+env(safe-area-inset-bottom))]   /* ✅ sobe o footer acima do bottom navbar */
      "
    >
      {/* CONTEÚDO (GRID) */}
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <div className="text-[16px] font-semibold tracking-wide">
              TUDOAKILO
            </div>
            <p className="mt-3 text-[13px] text-white/90">
              Transformando Clientes em Fãs!
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/15 grid place-items-center hover:bg-white/20 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/15 grid place-items-center hover:bg-white/20 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <FooterCol
            title="DÚVIDAS"
            items={[
              'Como Comprar',
              'Prazo de Entrega',
              'Trocas e Devoluções',
              'Política de Cashback',
              'Formas de Pagamento',
              'Perguntas Frequentes - FAQ',
            ]}
          />

          <FooterCol
            title="INSTITUCIONAL"
            items={[
              'Contato',
              'Garantia',
              'Quem Somos',
              'Política de Frete',
              'Termos de Serviço',
              'Política de Privacidade',
            ]}
          />

          {/* NEWSLETTER */}
          <div>
            <div className="text-[14px] font-semibold tracking-wide">
              RECEBA NOSSAS PROMOÇÕES
            </div>
            <p className="mt-3 text-[13px] text-white/90">
              Seja o primeiro a saber sobre novas coleções e ofertas exclusivas.
            </p>

            <div className="mt-4 bg-white rounded-2xl overflow-hidden">
              <div className="p-2 flex items-center gap-2">
                <input
                  className="h-11 px-3 flex-1 outline-none text-black text-[13px] bg-transparent"
                  placeholder="Seu email"
                />
                <button
                  className="h-11 w-11 rounded-xl bg-[#6b4a32] text-white grid place-items-center hover:brightness-95 transition"
                  aria-label="Enviar"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-[12px] text-white/80">
              Ao se cadastrar, você concorda com nossa política de privacidade.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM INSTITUCIONAL */}
      <div className="w-full border-t border-white/20">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 pt-6 pb-8">
          <div className="flex flex-col items-center gap-2 text-center text-[12px] text-white/90">
            <div>© 2025, tudoakilo. Todos direitos reservados.</div>

            <div className="max-w-[1100px] text-white/80 leading-relaxed">
              Tai Negócios Digitais LTDA · CNPJ: 55.177.241/0001-00 · Rua Mistral,
              332 · Jardim Bom Clima · Edif. The Point Torre A Sala 209A · Cuiabá - MT
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
