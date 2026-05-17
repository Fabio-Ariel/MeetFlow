'use server'

import { stripe } from '@/lib/stripe'

interface EventoCheckoutData {
  eventoId: string
  eventoNome: string
  eventoDescricao: string
  valorCentavos: number
  usuarioEmail?: string
}

export async function startCheckoutSession(data: EventoCheckoutData) {
  const { eventoId, eventoNome, eventoDescricao, valorCentavos, usuarioEmail } = data

  if (!valorCentavos || valorCentavos <= 0) {
    throw new Error('Valor invalido para o evento')
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: usuarioEmail,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: eventoNome,
            description: eventoDescricao || `Inscricao para ${eventoNome}`,
          },
          unit_amount: valorCentavos,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      eventoId,
    },
  })

  return session.client_secret
}

export async function verificarPagamento(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      status: session.payment_status,
      eventoId: session.metadata?.eventoId,
      pago: session.payment_status === 'paid'
    }
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return { status: 'error', pago: false }
  }
}
