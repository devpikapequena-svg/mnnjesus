'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="bg-[#6b4a32] text-white text-[13px]">
      <div className="mx-auto w-full max-w-[500px] px-6 h-10 flex items-center justify-center relative">
        <button className="absolute left-6 opacity-80 hover:opacity-100" aria-label="Anterior">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-medium">Frete Grátis a partir de R$ 90</span>

        <button className="absolute right-6 opacity-80 hover:opacity-100" aria-label="Próximo">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
