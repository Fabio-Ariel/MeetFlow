'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { inscreverEvento, cancelarInscricao } from '@/app/actions'

const CheckoutEvento = dynamic(() => import('./CheckoutEvento'), { ssr: false })

interface BotaoInscricaoProps {
  eventoId: string
  eventoNome: string
  eventoDescricao: string
  pago: boolean
  valor?: number | null
  jaInscrito: boolean
  usuarioLogado: boolean
  usuarioEmail?: string
  vagas?: number | null
  inscricoes?: number
}

export default function BotaoInscricao({
  eventoId,
  eventoNome,
  eventoDescricao,
  pago,
  valor,
  jaInscrito,
  usuarioLogado,
  usuarioEmail,
  vagas,
  inscricoes = 0
}: BotaoInscricaoProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [inscrito, setInscrito] = useState(jaInscrito)
  const [error, setError] = useState<string | null>(null)

  const vagasDisponiveis = vagas ? vagas - inscricoes : null
  const esgotado = vagasDisponiveis !== null && vagasDisponiveis <= 0

  const handleInscrever = async () => {
    if (!usuarioLogado) {
      router.push('/login')
      return
    }

    if (esgotado) {
      setError('Vagas esgotadas')
      return
    }

    setError(null)
    setLoading(true)

    try {
      if (pago && valor && valor > 0) {
        // Evento pago - abrir checkout
        setShowCheckout(true)
      } else {
        // Evento gratuito - inscrever diretamente
        const result = await inscreverEvento(eventoId)
        if (result.success) {
          setInscrito(true)
        } else if (result.requireAuth) {
          router.push('/login')
        } else {
          setError(result.error || 'Erro ao inscrever')
        }
      }
    } catch {
      setError('Erro ao processar inscricao')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await cancelarInscricao(eventoId)
      if (result.success) {
        setInscrito(false)
      } else {
        setError(result.error || 'Erro ao cancelar')
      }
    } catch {
      setError('Erro ao cancelar inscricao')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckoutClose = () => {
    setShowCheckout(false)
    setLoading(false)
  }

  const handleCheckoutSuccess = () => {
    setShowCheckout(false)
    setInscrito(true)
    router.refresh()
  }

  if (inscrito) {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Voce esta inscrito!
          </div>
        </div>
        <button
          onClick={handleCancelar}
          disabled={loading}
          className="w-full py-3 px-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cancelando...' : 'Cancelar Inscricao'}
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={handleInscrever}
          disabled={loading || esgotado}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            esgotado
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processando...
            </span>
          ) : esgotado ? (
            'Vagas Esgotadas'
          ) : pago && valor ? (
            `Inscrever-se - R$ ${valor.toFixed(2).replace('.', ',')}`
          ) : (
            'Inscrever-se Gratuitamente'
          )}
        </button>

        {vagasDisponiveis !== null && !esgotado && (
          <p className="text-center text-sm text-gray-500">
            {vagasDisponiveis} {vagasDisponiveis === 1 ? 'vaga disponivel' : 'vagas disponiveis'}
          </p>
        )}
      </div>

      {showCheckout && valor && (
        <CheckoutEvento
          eventoId={eventoId}
          eventoNome={eventoNome}
          eventoDescricao={eventoDescricao}
          valorCentavos={Math.round(valor * 100)}
          usuarioEmail={usuarioEmail}
          onSuccess={handleCheckoutSuccess}
          onClose={handleCheckoutClose}
        />
      )}
    </>
  )
}
