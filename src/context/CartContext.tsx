'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import { toast } from 'react-toastify' // Importando o toast

export type CartItem = {
  id: string // ex: productId + variantId
  name: string
  variantName?: string
  price: number
  image: string
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  cartCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  inc: (id: string) => void
  dec: (id: string) => void
  remove: (id: string) => void
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartCount = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items])
  const total = useMemo(() => items.reduce((acc, it) => acc + it.qty * it.price, 0), [items])

  function openCart() {
    setIsCartOpen(true)
  }
  function closeCart() {
    setIsCartOpen(false)
  }

  function addItem(item: Omit<CartItem, 'qty'>, qty = 1) {
    // Verifica se já há 4 itens no carrinho
    const currentCartCount = items.reduce((acc, it) => acc + it.qty, 0)
    if (currentCartCount + qty > 4) {
      toast.error("Você não pode adicionar mais do que 4 produtos ao carrinho. Limite de estoque atingido.") // Exibe a notificação de erro
      return
    }

    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id)
      if (idx !== -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty }
        return copy
      }
      return [...prev, { ...item, qty }]
    })
    setIsCartOpen(true) // ✅ abre modal ao adicionar
  }

  function inc(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)))
  }

  function dec(id: string) {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
        .filter((it) => it.qty > 0)
    )
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const value: CartContextValue = {
    items,
    cartCount,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    inc,
    dec,
    remove,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
