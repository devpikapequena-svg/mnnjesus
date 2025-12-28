'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Search, ShoppingBag, Menu } from 'lucide-react'
import clsx from 'clsx'
import CartModal from '@/components/tudoakilo/CartModal'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const [hideTopbar, setHideTopbar] = useState(false)
  const { cartCount, openCart } = useCart()

  useEffect(() => {
    let lastScroll = 0
    function onScroll() {
      const current = window.scrollY
      if (current > 40 && current > lastScroll) setHideTopbar(true)
      if (current < 20) setHideTopbar(false)
      lastScroll = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="sticky top-0 z-50">
        {/* TOPBAR (some ao rolar) */}
        <div
          className={clsx(
            'bg-white border-b border-black/5 transition-all duration-300 ease-out overflow-hidden',
            hideTopbar ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
          )}
        >
        </div>

        {/* HEADER FIXO */}
        <header className="bg-white border-b border-black/5">
          <div className="mx-auto w-full max-w-[1500px] px-4 lg:px-0">
            <div className="h-14 md:h-16 flex items-center justify-between">
              {/* LEFT (mobile) */}
              <div className="flex items-center gap-3 md:hidden text-[#6b4a32]">
                <button className="w-10 h-10 grid place-items-center rounded-full hover:bg-black/5">
                  <Menu className="w-6 h-6" />
                </button>
                <button className="w-10 h-10 grid place-items-center rounded-full hover:bg-black/5">
                  <Search className="w-6 h-6" />
                </button>
              </div>

              {/* LEFT (desktop) */}
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-[#6b4a32]">
                  <Search className="w-5 h-5" />
                  <span className="text-[13px] text-black/60">Pesquisar</span>
                </div>
              </div>

            {/* LOGO SVG */}
            <div className="select-none flex items-center">
              <Image
                src="/lg02.svg"
                alt="TudoAkilo"
                width={110}
                height={32}
                priority
                className="h-[18px] w-auto md:h-[22px]"
              />
            </div>

              {/* RIGHT: CARRINHO COM BOLINHA */}
              <button
                onClick={openCart}
                className="relative w-10 h-10 md:w-auto md:h-auto grid place-items-center md:flex md:items-center md:gap-2 text-[#6b4a32] hover:bg-black/5 md:hover:bg-transparent rounded-full"
                aria-label="Carrinho"
              >
                <span className="relative">
                  <ShoppingBag className="w-6 h-6 md:w-5 md:h-5" />

                  {cartCount > 0 ? (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6b4a32] text-white text-[11px] leading-[18px] font-semibold text-center">
                      {cartCount}
                    </span>
                  ) : null}
                </span>

                <span className="hidden md:inline text-[13px] text-black/70">Carrinho</span>
              </button>
            </div>

            <nav className="hidden md:flex h-12 items-center gap-6 text-[13px] text-black/70">
              {['Início', 'Catálogo', 'Sobre Nós', 'Fale Conosco', 'Rastrear Pedido'].map((item) => (
                <a key={item} href="#" className="hover:text-black transition-colors">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>
      </div>

      {/* MODAL DO CARRINHO */}
      <CartModal />
    </>
  )
}
