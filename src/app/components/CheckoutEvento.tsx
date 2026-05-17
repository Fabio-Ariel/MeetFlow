'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutEventoProps {
  eventoId: string
  eventoNome: string
  eventoDescricao: string
  valorCentavos: number
  usuarioEmail?: string
  onSuccess?: () => void
  onClose?: () => void
}

export default function CheckoutEvento({
  eventoId,
  eventoNome,
  eventoDescricao,
  valorCentavos,
  usuarioEmail,
  onClose
}: CheckoutEventoProps) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await startCheckoutSession({
        eventoId,
        eventoNome,
        eventoDescricao,
        valorCentavos,
        usuarioEmail
      })
      if (!clientSecret) {
        throw new Error('Erro ao iniciar checkout')
      }
      return clientSecret
    } catch (err) {
      setError('Erro ao iniciar pagamento. Tente novamente.')
      throw err
    }
  }, [eventoId, eventoNome, eventoDescricao, valorCentavos, usuarioEmail])

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Erro no Pagamento</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{eventoNome}</h3>
            <p className="text-sm text-gray-500">
              Valor: R$ {(valorCentavos / 100).toFixed(2).replace('.', ',')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="checkout" className="p-4">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
