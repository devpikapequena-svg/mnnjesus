'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Faq, Spec } from '@/components/tudoakilo/ui'

export default function RightSections() {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
      {/* header “Saiba Mais” */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5"
        aria-label="Saiba Mais"
      >
        <span className="text-[14px] font-medium text-[#6b4a32]">Saiba Mais</span>
        <span className="inline-flex items-center gap-2 text-[#6b4a32]">
          {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-8">
          {/* título igual print */}
          <h2 className="mt-2 text-[22px] md:text-[24px] font-semibold text-[#b08c6a] text-center leading-snug">
            O abraço que acalma, embala e protege o sono do seu bebê!
          </h2>

          {/* “vídeo” (use sua imagem/thumbnail) */}
          <div className="mt-6 overflow-hidden bg-black/5">
<div className="relative w-full h-[520px] md:h-[620px] lg:h-[700px]">
              <Image
                src="/demostra.gif"
                alt="Demonstração"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
          </div>

          {/* texto */}
          <p className="mt-6 text-[13px] text-[#b08c6a] text-center leading-relaxed">
            A Pelúcia <span className="font-semibold">Menino Jesus que Respira</span> foi desenvolvida
            para acolher o bebê com respiração simulada, sons suaves e toque macio. Mais do que um
            brinquedo, é um gesto de fé, aconchego e paz para toda a família.
          </p>

          <p className="mt-6 text-[20px] text-[#b08c6a] text-center leading-snug">
            Mais que um presente — uma lembrança para a vida toda.
          </p>

          <h3 className="mt-8 text-[16px] font-semibold text-[#b08c6a] text-center">
            Por que as mães estão amando?
          </h3>

          {/* bullets como no print */}
          <div className="mt-6 space-y-4 text-[14px] leading-relaxed">
            <div className="text-[#b08c6a]">
              ✨ <span className="font-semibold text-[#b08c6a]">Acalma como um colo:</span>{' '}
              a respiração simulada e os sons suaves trazem segurança imediata, como se o bebê
              estivesse sempre abraçado.
            </div>
            <div className="text-[#b08c6a]">
              🕊️ <span className="font-semibold text-[#b08c6a]">Traz paz até nos dias difíceis:</span>{' '}
              o Menino Jesus transmite presença e acolhimento, aliviando as madrugadas cansativas.
            </div>
            <div className="text-[#b08c6a]">
              🤝 <span className="font-semibold text-[#b08c6a]">Um carinho que fica:</span>{' '}
              o toque macio e o formato ideal criam vínculo afetivo desde os primeiros dias de vida.
            </div>
            <div className="text-[#b08c6a]">
              🎁 <span className="font-semibold text-[#b08c6a]">Presente cheio de propósito:</span>{' '}
              ideal para nascimento, batizado ou chá de bebê, emociona quem dá e quem recebe.
            </div>
          </div>

          {/* garantia (imagem ou fallback) */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[360px]">
              <div className="relative w-full aspect-[5/3]">
                <Image
                  src="/selo.png"
                  alt="Garantia 7 dias"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] text-[#b08c6a] text-center leading-relaxed">
            Acreditamos fortemente na qualidade de nossos produtos e na satisfação total dos nossos
            clientes. É por isso que oferecemos uma Garantia de 7 Dias, sem questionamentos!
          </p>

          {/* Especificações */}
          <h3 className="mt-10 text-[20px] text-[#b08c6a] text-center">Especificações</h3>

          <ul className="mt-6 space-y-2 text-[13px] text-black/70">
            <Spec label="Material" value="Pelúcia hipoalergênica" />
            <Spec label="Fonte de energia" value="3 pilhas AAA (não inclusas)" />
            <Spec label="Cores" value="Vermelho ou Azul" />
            <Spec label="Gênero" value="Unissex" />
            <Spec label="Dimensões aproximadas" value="40 × 22 × 14 cm" />
            <Spec label="Peso aproximado" value="280 g" />
            <Spec label="Brinquedo com luz" value="Sim" />
            <Spec label="Brinquedo com som" value="Sim" />
            <Spec label="Brinquedo com voz" value="Não" />
          </ul>

          <div className="mt-6 text-[13px] text-red-600 font-semibold">
            Atenção:{' '}
            <span className="font-normal text-black/55">
              utilize sob supervisão de um adulto e mantenha o compartimento de pilhas fora do alcance do bebê.
            </span>
          </div>

          <div className="mt-3 text-[12px] text-[#b08c6a] italic">
            As imagens podem apresentar pequenas variações de cor conforme o monitor e a resolução utilizados.
          </div>

   {/* FAQ – estilo texto (sem dropdown) */}
<h3 className="mt-12 text-[20px] text-[#b08c6a] text-center">
  Perguntas Frequentes
</h3>

<div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[#b08c6a]">
  <div>
    <p className="font-medium">
      A Pelúcia Menino Jesus que Respira ajuda no sono do bebê?
    </p>
    <p className="mt-1 text-[#b08c6a]">
      Sim. A respiração simulada e os sons suaves criam um ambiente calmo que
      facilita o adormecer e transmite segurança.
    </p>
  </div>

  <div>
    <p className="font-medium">
      É segura para bebês?
    </p>
    <p className="mt-1 text-[#b08c6a]">
      Sim. Produzida em pelúcia hipoalergênica, é macia e adequada para bebês.
      Apenas mantenha supervisão durante o uso.
    </p>
  </div>

  <div>
    <p className="font-medium">
      Como funciona a respiração simulada?
    </p>
    <p className="mt-1 text-[#b08c6a]">
      Com 3 pilhas AAA, o brinquedo ativa luz, som e movimento suave que reproduz
      uma respiração realista para acalmar o bebê.
    </p>
  </div>
</div>
</div>
      )}
    </div>
  )
}
