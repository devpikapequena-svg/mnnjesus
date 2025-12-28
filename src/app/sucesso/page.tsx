'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { currency } from '@/components/tudoakilo/ui'

export default function SuccessPage() {
  const router = useRouter()

  // Função para calcular a data de entrega (3 dias após a data atual)
  const calculateDeliveryDate = () => {
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + 3) // Adiciona 3 dias à data atual
    return deliveryDate.toLocaleDateString('pt-BR') // Formata a data no formato brasileiro
  }

  const [orderDetails, setOrderDetails] = useState({
    orderId: '12345',
    totalAmount: 150.75,
    shipping: 'Envio Prioritário',
    deliveryDate: calculateDeliveryDate(),
  })

  useEffect(() => {
    // Aqui você pode pegar as informações reais do pedido, se necessário.
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#1b1b1b]">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-black/10">
        <div className="mx-auto w-full max-w-[980px] h-[64px] px-4 flex items-center justify-center relative">
          <img src="/lg02.svg" alt="TUDOAKILO" width={160} height={34} />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[980px] px-4 py-8">
        {/* SUCCESS MESSAGE */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h1 className="text-[28px] font-extrabold text-[#6b4a32]">
            Pagamento Concluído com Sucesso!
          </h1>
          <p className="text-[16px] text-black/75">
            Seu pedido foi confirmado e está sendo processado.
          </p>

          <div className="mt-4 text-black/60">
            <div className="font-semibold text-[18px]">Atenção!</div>
            <div className="mt-3 text-[14px] text-black/70">
              Seu pedido será enviado até {orderDetails.deliveryDate}. O frete escolhido foi: <b>{orderDetails.shipping}</b>.
            </div>
          </div>

          {/* Ações para o usuário */}
          <div className="mt-8 flex gap-4">
            <button
              className="w-48 h-12 rounded-2xl bg-[#5b3f2a] text-white font-extrabold text-[16px] hover:brightness-95"
              onClick={() => router.push('/loja')} // Redireciona para a loja
            >
              Voltar à Loja
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
