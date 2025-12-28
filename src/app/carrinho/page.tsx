'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import { FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

/** Produtos recomendados por categoria para “Complete seu pedido” **/
const recommendedProducts = {
  Panetones: [
    {
      id: 1,
      slug: 'panetone-chocolate-ao-leite-420g',
      name: 'Panetone de Chocolate ao Leite 420g',
      price: 49.9,
      oldPrice: 64.9,
      image: 'https://cacau.entregasnacionais.top/images/sabores/1.webp',
    },
    {
      id: 2,
      slug: 'panetone-lacreme-ao-leite-650g',
      name: 'Panetone laCreme ao Leite 650g',
      price: 79.9,
      oldPrice: 99.9,
      image: 'https://cacau.entregasnacionais.top/images/sabores/2.webp',
    },
    {
      id: 16,
      slug: 'panetone-brigadeiro-580g',
      name: 'Panetone com Recheio de Brigadeiro 580g',
      price: 69.9,
      oldPrice: 89.9,
      image: 'https://cacau.entregasnacionais.top/images/sabores/3.webp', // Substitua pela imagem correta
    },
  ],
  'Chocolates, Cestas e Presentes': [
    {
      id: 20,
      slug: 'drageados-arvore-natal',
      name: 'Drageados Árvore de Natal ao Leite e Branco 70g',
      price: 14.9,
      oldPrice: 24.9,
      image: 'https://cacau.entregasnacionais.top/images/sabores/16.webp',
    },
    {
      id: 21,
      slug: 'arvore-natal-150cm-verde',
      name: 'Árvore de Natal de 1.50cm VERDE',
      price: 79.9,
      oldPrice: 119.9,
      image: 'https://cacau.entregasnacionais.top/images/sabores/24.webp',
    },
        {
      id: 22,
      slug: 'tablete-te-amo',
      name: 'Tablete ao Leite Chocoarte Te Amo 40g',
      price: 14.9,
      oldPrice: 24.9,
      image: 'https://cacau.entregasnacionais.top/images/sabores/25.webp',
    },
  ],
}

export default function CartPage() {
  const { items, removeItem, increaseQty, decreaseQty, addItem, getSubtotal } = useCart()
  const router = useRouter()

  const deliveryCost = 0
  const total = getSubtotal() + deliveryCost
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white font-sans max-w-md mx-auto">
        <p className="text-gray-600 text-lg mb-6">Seu carrinho está vazio.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-3 bg-[#3a1a0a] text-white rounded font-semibold hover:bg-[#5a2e14] transition"
        >
          Voltar ao início
        </button>
      </div>
    )
  }

  return (
<main className="min-h-screen max-w-md mx-auto bg-white font-sans px-4 py-6 pt-20 pb-28">      {/* Header */}
    {/* Header fixo no topo */}
<button
  onClick={() => router.back()}
  className="flex items-center gap-3 text-[#3a1a0a] font-semibold mb-6 py-3 bg-white fixed top-0 left-0 right-0 px-4 z-50 border-b border-gray-200"
  aria-label="Voltar"
  style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}
>
  <FaArrowLeft className="w-5 h-5" />
  <span className="text-lg">Seu Carrinho</span>
  <span className="ml-auto bg-[#3a1a0a] text-white rounded-full px-1 text-xs font-bold min-w-[20px] text-center">
    {totalItems}
  </span>
</button>

      {/* Itens do carrinho */}
      <div className="space-y-4 mb-6">
        {items.map(({ product, quantity, detail }) => (
          <div key={`${product.slug}-${detail ?? ''}`} className="flex items-center gap-4 border rounded-md p-3">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-contain rounded" loading="lazy" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{product.name}</p>
              {detail && <p className="text-xs text-gray-500">Detalhe: {detail}</p>}
              <p className="mt-1 font-bold text-[#381007]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => decreaseQty(product.slug, detail)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  aria-label={`Diminuir quantidade de ${product.name}`}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => increaseQty(product.slug, detail)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  aria-label={`Aumentar quantidade de ${product.name}`}
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(product.slug, detail)}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label={`Remover ${product.name} do carrinho`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    {/* Resumo */}
<div className="border rounded-md p-4 mb-6 space-y-2 text-sm">
  <div className="flex justify-between">
    <span>Subtotal</span>
    <span className="text-[#381007]">
      R$ {getSubtotal().toFixed(2).replace('.', ',')}
    </span>
  </div>
  <div className="flex justify-between mb-8"> {/* Espaço maior entre Entrega e Total */}
    <span>Entrega</span>
    <span>Grátis</span>
  </div>
  <div className="flex justify-between font-bold text-lg">
    <span>Total</span>
    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
  </div>
</div>

<button
  onClick={() => router.push('/checkout')}
  className="w-full bg-[#3a1a0a] text-white py-3 rounded font-bold hover:bg-[#5a2e14] transition flex items-center justify-center gap-2"
>
  <FaCreditCard className="w-5 h-5" />
  Finalizar
</button>

      {/* Complete seu pedido */}
      <section className="mt-8">
        <h3 className="font-bold mb-4 text-[#311007]">+ Complete seu pedido</h3>
        {Object.entries(recommendedProducts).map(([category, prods]) => (
          <div key={category} className="mb-8">
            <div className="flex justify-between items-center mb-2 px-1">
              <h4 className="font-semibold">{category}</h4>
              <button className="bg-[#381007] text-white rounded px-3 py-1 text-xs font-semibold hover:bg-[#5a1a07] transition">
                Ver tudo ({prods.length})
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 px-1">
              {prods.map(prod => (
                <div key={prod.id} className="bg-white rounded-md shadow p-3 flex flex-col">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="object-contain w-full h-28 mb-2 rounded"
                    loading="lazy"
                  />
                  <p className="text-[12px]  mb-1">{prod.name}</p>
<div className="flex items-center mb-2 gap-2">
  <p className="text-red-600 text-xs line-through whitespace-nowrap">
    R$ {prod.oldPrice?.toFixed(2).replace('.', ',')}
  </p>
  <p className="text-[#0a7a0f] text-xs font-bold whitespace-nowrap">
    R$ {prod.price.toFixed(2).replace('.', ',')}
  </p>
</div>
                  <button
                    onClick={() => addItem({
                      id: prod.id,
                      slug: prod.slug,
                      category,
                      name: prod.name,
                      price: prod.price,
                      promo: false,
                      image: prod.image,
                    })}
                    className="bg-[#3a1a0a] text-white py-1.5 rounded text-xs font-semibold hover:bg-[#5a2e14] transition"
                  >
                    + Aproveitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}