'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import './globals.css'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import { PaymentProvider } from '@/context/PaymentContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const META_PIXEL_ID = '1248414514007813'  // Updated Meta Pixel ID
const UTMIFY_PIXEL_ID = '69589cd46ff07ca8358dc19b' // Updated Utmify Pixel ID

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const isNotFoundPage = pathname === '/_not-found'

  useEffect(() => {
    if (isNotFoundPage) return

    setIsNavigating(true)
    const timer = setTimeout(() => setIsNavigating(false), 500)

    const handleLoad = () => {
      setIsNavigating(false)
      clearTimeout(timer)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(timer)
    }
  }, [pathname, searchParams, isNotFoundPage])

  useEffect(() => {
    if (isNotFoundPage) return

    if (typeof window !== 'undefined') {
      // Meta PageView SPA
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'PageView')
      }

      // TikTok PageView SPA
      if (typeof (window as any).ttq === 'function') {
        (window as any).ttq.page()
      }
    }
  }, [pathname, searchParams, isNotFoundPage])

  return (
    <>
      {isNavigating && !isNotFoundPage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <div className="loading-spinner" />
        </div>
      )}

      <div
        className={cn(
          'min-h-screen bg-background font-sans antialiased transition-opacity duration-300',
          isNavigating && !isNotFoundPage ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Pelúcia Menino Jesus que Respira | Acalma a Alma</title>
        <meta
          name="description"
          content="Pelúcia Menino Jesus que Respira | Acalma a Alma"
        />
        <meta name="robots" content="index, follow" />

        {/* ================================
            Utmify Pixel (Google)
        ================================= */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            window.googlePixelId = "${UTMIFY_PIXEL_ID}";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute(
              "src",
              "https://cdn.utmify.com.br/scripts/pixel/pixel-google.js"
            );
            document.head.appendChild(a);
          `}
        </Script>

        {/* ================================
            Meta Pixel
        ================================= */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
            t=b.createElement(e);t.async=!0;t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body className={cn('font-sans', inter.variable)}>
        {/* Meta noscript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <CartProvider>
          <PaymentProvider>
            <Suspense fallback={null}>
              <LayoutContent>{children}</LayoutContent>
            </Suspense>
          </PaymentProvider>
        </CartProvider>
      </body>
    </html>
  )
}
