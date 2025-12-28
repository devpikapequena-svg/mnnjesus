'use client'

import { useMemo, useState, useEffect } from 'react'
import TopBar from '@/components/tudoakilo/TopBar'
import Header from '@/components/tudoakilo/Header'
import ProductGallery from '@/components/tudoakilo/ProductGallery'
import BuyBox from '@/components/tudoakilo/BuyBox'
import RightSections from '@/components/tudoakilo/RightSections'
import Reviews from '@/components/tudoakilo/Reviews'
import Footer from '@/components/tudoakilo/Footer'
import { useCart } from '@/context/CartContext'

import { ToastContainer } from 'react-toastify' // Importando o ToastContainer
import 'react-toastify/dist/ReactToastify.css' // Importando os estilos do Toastify
import { FaComments } from 'react-icons/fa'

// Notification component for purchase alert
function Notification({ name, variantImage, showNotification, closeNotification }: { name: string, variantImage: string, showNotification: boolean, closeNotification: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeNotification(); // Hide after 5 seconds
    }, 5000); 

    return () => clearTimeout(timer);
  }, [showNotification]);

  if (!showNotification) return null;

return (
  <div className="fixed bottom-20 left-4 w-80 bg-white p-2 rounded-xl shadow-lg flex items-center gap-4 z-50">
    <div className="w-16 h-16 bg-cover bg-center" style={{ backgroundImage: `url(${variantImage})` }}></div>
    <div className="flex flex-col">
      <span className="font-semibold text-[#b08c6a]">{name} comprou</span>
      <span className="text-sm text-[#b08c6a]">Pelúcia Menino Jesus</span>
      <span className="text-xs text-[#b08c6a]">Há 7 minutos</span>
    </div>
    <button onClick={closeNotification} className="text-xl ml-4 text-[#b08c6a]">
      &times;
    </button>
  </div>
);

}

export type Variant = {
  id: string
  name: string
  swatch?: string
  thumb: string
}

export type Review = {
  id: string
  name: string
  verified?: boolean
  rating: number
  text: string
  image?: string
}

export type ProductData = {
  name: string
  badges: string[]
  rating: number
  ratingCount: number
  oldPrice: number
  price: number
  cashbackLabel: string
  stockLeft: number
  variants: Variant[]
  gallery: string[]
  reviews: Review[]
}

export default function Page() {
  const product = useMemo<ProductData>(() => {
    const variants: Variant[] = [
      { id: 'vermelho', name: 'Vermelho', swatch: '#C83B3B', thumb: '/vermelho.png' },
      { id: 'azul', name: 'Azul', swatch: '#2F6DE0', thumb: '/azul.png' },
    ]

    const gallery = [
      '/7thumb.png',
      '/8thumb.png',
      '/9thumb.png',
      '/10thumb.png',
      '/passoapasso.png',
      '/2thumb.png',
      '/3thumb.png',
      '/4thumb.png',
      '/5thumb.png', // ✅ vermelho (target)
      '/6thumb.png', // ✅ azul (target)
    ]

    const reviews: Review[] = [
      {
        id: 'r1',
        name: 'Fabiana Marques',
        verified: true,
        rating: 5,
        text: 'É tão real que arrepia...',
        image: '/review1.jpg',
      },
      // More reviews here
    ]

    return {
      name: 'Pelúcia Menino Jesus que Respira e Acalma a Alma',
      badges: ['1º MAIS VENDIDO', 'OFERTA DO DIA'],
      rating: 4.9,
      ratingCount: 480,
      oldPrice: 399.9,
      price: 97.9,
      cashbackLabel: '20% de Cashback!',
      stockLeft: 25,
      variants,
      gallery,
      reviews,
    }
  }, [])

  const [activeImg, setActiveImg] = useState(0)
  const [activeVariant, setActiveVariant] = useState(product.variants[0]?.id ?? 'vermelho')
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  function handleVariantChange(id: string) {
    setActiveVariant(id)

    const targetSrc = id === 'vermelho' ? '/5thumb.png' : id === 'azul' ? '/6thumb.png' : null
    if (!targetSrc) return

    const idx = product.gallery.findIndex((src) => src === targetSrc)
    if (idx !== -1) setActiveImg(idx)
  }

  // Notification logic
  const [notifications, setNotifications] = useState<{ name: string, variantImage: string }[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const triggerNotification = () => {
    const names = ['Júlia', 'Carlos', 'Renata', 'Lucas', 'Beatriz'];
    const name = names[Math.floor(Math.random() * names.length)];
    const variant = product.variants[Math.floor(Math.random() * product.variants.length)];
    
    setNotifications(prev => [...prev, { name, variantImage: variant.thumb }]);
    setShowNotification(true);
  };

  const closeNotification = () => setShowNotification(false);

  useEffect(() => {
    // First notification after 5 seconds
    const firstNotificationTimer = setTimeout(() => {
      triggerNotification(); // Trigger first notification after 5 seconds
    }, 5000); // 5000ms = 5 seconds

    // Subsequent notifications every 5 minutes
    const intervalId = setInterval(() => {
      triggerNotification(); // Trigger subsequent notifications every 5 minutes
    }, 900000); // 300000ms = 5 minutes

    return () => {
      clearTimeout(firstNotificationTimer);
      clearInterval(intervalId);
    };
  }, []);

  // Estado para mostrar o nav no mobile
  const [showNav, setShowNav] = useState(false)

  // Exibe o nav quando o usuário rolar a página para baixo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) { // Defina o valor que preferir
        setShowNav(true)
      } else {
        setShowNav(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#faf7f3] text-[#1b1b1b]">
      <TopBar />
      <Header />

      <main className="mx-auto w-full max-w-[1500px] px-3 sm:px-4 lg:px-0 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[820px_620px] gap-3 sm:gap-6 lg:gap-8 items-start">
          <div className="relative">
            <div className="lg:sticky lg:top-[112px]">
              <ProductGallery
                productName={product.name}
                gallery={product.gallery}
                activeImg={activeImg}
                setActiveImg={setActiveImg}
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <BuyBox
              product={product}
              activeVariant={activeVariant}
              setActiveVariant={handleVariantChange}
              qty={qty}
              setQty={setQty}
            />
            <RightSections />
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <Reviews product={product} />
        </div>
      </main>

      <Footer />

      {/* ToastContainer para notificações */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Bottom Nav (Aparece quando rolar a página para baixo) */}
      {showNav && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-black/10 shadow-lg z-50">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <select
                value={activeVariant}
                onChange={(e) => handleVariantChange(e.target.value)}
                className="border rounded-lg p-2 focus:outline-none focus:ring-0" // Remove o foco
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id} style={{ backgroundColor: v.swatch }}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-[260px] h-12 rounded-2xl bg-[#6b4a32] text-white font-bold text-[14px] hover:brightness-95"
              onClick={() => {
                const variant = product.variants.find(v => v.id === activeVariant)
                if (variant) {
                  addItem(
                    {
                      id: `menino-jesus-${activeVariant}`,
                      name: product.name,
                      variantName: variant.name,
                      price: product.price,
                      image: variant.thumb, // Imagem da variante
                    },
                    qty
                  )
                }
              }}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      )}

      {/* Notification Component */}
      {notifications.map((notif, idx) => (
        <Notification
          key={idx}
          name={notif.name}
          variantImage={notif.variantImage}
          showNotification={showNotification}
          closeNotification={closeNotification}
        />
      ))}
    </div>
  )
}
