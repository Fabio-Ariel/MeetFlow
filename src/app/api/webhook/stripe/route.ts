import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    if (session.payment_status === 'paid') {
      const eventoId = session.metadata?.eventoId
      const usuarioEmail = session.customer_email

      if (eventoId && usuarioEmail) {
        try {
          // Buscar usuario pelo email
          const usuario = await prisma.usuario.findUnique({
            where: { email: usuarioEmail }
          })

          if (usuario) {
            // Verificar se ja esta inscrito
            const inscricaoExistente = await prisma.inscricao.findUnique({
              where: {
                usuarioId_eventoId: {
                  usuarioId: usuario.id,
                  eventoId
                }
              }
            })

            if (!inscricaoExistente) {
              // Criar inscricao
              await prisma.inscricao.create({
                data: {
                  usuarioId: usuario.id,
                  eventoId,
                  status: 'confirmado'
                }
              })

              // Criar notificacao
              await prisma.notificacao.create({
                data: {
                  usuarioId: usuario.id,
                  eventoId,
                  tipo: 'inscricao',
                  mensagem: 'Pagamento confirmado! Sua inscricao foi realizada com sucesso.',
                  lida: false
                }
              })
            }
          }
        } catch (error) {
          console.error('Erro ao processar pagamento:', error)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
