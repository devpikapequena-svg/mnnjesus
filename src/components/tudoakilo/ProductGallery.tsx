'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'

export default function ProductGallery({
  productName,
  gallery,
  activeImg,
  setActiveImg,
}: {
  productName: string
  gallery: string[]
  activeImg: number
  setActiveImg: (n: number) => void
}) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)

  // swipe refs
  const startX = useRef(0)
  const isDragging = useRef(false)

  // animation state
  const [animDir, setAnimDir] = useState<0 | 1 | -1>(0) // 1 next, -1 prev, 0 none
  const [prevImg, setPrevImg] = useState(activeImg)

  useEffect(() => {
    const el = itemRefs.current[activeImg]
    if (!el) return
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeImg])

  // whenever activeImg changes, keep track of prev for slide animation
  useEffect(() => {
    if (activeImg === prevImg) return
    setPrevImg((p) => p) // keep previous in render for one frame
    // after transition ends we will set prevImg = activeImg
    // (handled by onTransitionEnd)
  }, [activeImg]) // eslint-disable-line react-hooks/exhaustive-deps

  function goTo(nextIndex: number) {
    if (nextIndex === activeImg) return
    const dir: 1 | -1 = nextIndex > activeImg ? 1 : -1
    setAnimDir(dir)
    setPrevImg(activeImg)
    // small rAF to ensure prev is committed before switching image
    requestAnimationFrame(() => {
      setActiveImg(nextIndex)
    })
  }

  function handlePointerDown(e: React.PointerEvent) {
    startX.current = e.clientX
    isDragging.current = true
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!isDragging.current) return
    isDragging.current = false

    const deltaX = e.clientX - startX.current
    const threshold = 60

    if (deltaX < -threshold && activeImg < gallery.length - 1) {
      goTo(activeImg + 1)
    } else if (deltaX > threshold && activeImg > 0) {
      goTo(activeImg - 1)
    }
  }

  function handlePointerLeave() {
    isDragging.current = false
  }

  // slide positions
  // prev slides out opposite direction, current slides in from direction
  const prevTranslate =
    animDir === 1 ? '-translate-x-full' : animDir === -1 ? 'translate-x-full' : 'translate-x-0'
  const currStart =
    animDir === 1 ? 'translate-x-full' : animDir === -1 ? '-translate-x-full' : 'translate-x-0'

  const [ready, setReady] = useState(false)
  useEffect(() => {
    // trigger transition on next paint after activeImg change
    if (animDir !== 0) {
      setReady(false)
      requestAnimationFrame(() => setReady(true))
    }
  }, [activeImg, animDir])

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
      <div className="grid grid-cols-[1fr_84px] sm:grid-cols-[1fr_96px] lg:grid-cols-[1fr_120px] gap-0">
        {/* MAIN (swipe + slide) */}
        <div
          className="relative overflow-hidden bg-[#f4efe9] touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[700px]">
            {/* PREV layer */}
            <div
              className={[
                'absolute inset-0 will-change-transform transition-transform duration-300 ease-out',
                ready ? prevTranslate : 'translate-x-0',
                animDir === 0 ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
              onTransitionEnd={() => {
                // cleanup after slide finishes
                setAnimDir(0)
                setPrevImg(activeImg)
              }}
              aria-hidden="true"
            >
              <Image
                src={gallery[prevImg]}
                alt={productName}
                fill
                className="object-cover select-none"
                sizes="(max-width: 1024px) 100vw, 820px"
              />
            </div>

            {/* CURRENT layer */}
            <div
              className={[
                'absolute inset-0 will-change-transform transition-transform duration-300 ease-out',
                animDir === 0 ? 'translate-x-0' : ready ? 'translate-x-0' : currStart,
              ].join(' ')}
            >
              <Image
                src={gallery[activeImg]}
                alt={productName}
                fill
                className="object-cover select-none"
                priority
                sizes="(max-width: 1024px) 100vw, 820px"
              />
            </div>
          </div>

          {/* zoom */}
          <button
            className="absolute right-4 top-4 w-11 h-11 rounded-full bg-white/95 shadow grid place-items-center"
            aria-label="Zoom"
            type="button"
          >
            <Plus className="w-5 h-5 text-[#6b4a32]" />
          </button>

          {/* contador */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 text-[12px] px-3 py-1 rounded-full shadow-sm">
            {activeImg + 1}/{gallery.length}
          </div>
        </div>

        {/* THUMBS */}
        <div className="h-full bg-white">
          <div
            ref={listRef}
            className="h-full max-h-[360px] sm:max-h-[440px] lg:max-h-[700px] overflow-auto space-y-2 pr-0 pl-2"
          >
            {gallery.slice(0, 10).map((src, idx) => {
              const active = idx === activeImg
              return (
                <button
                  key={src}
                  ref={(el) => {
                    itemRefs.current[idx] = el
                  }}
                  onClick={() => goTo(idx)}
                  className={[
                    'w-full overflow-hidden border transition bg-white rounded-xl',
                    active
                      ? 'border-[#6b4a32] ring-2 ring-[#6b4a32]/30'
                      : 'border-black/10 hover:border-black/20',
                  ].join(' ')}
                  aria-label={`Selecionar imagem ${idx + 1}`}
                  type="button"
                >
                  <div className="relative w-full aspect-square bg-[#f4efe9]">
                    <Image src={src} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
