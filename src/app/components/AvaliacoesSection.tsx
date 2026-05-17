'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Avaliacao {
  id: string;
  nota: number;
  comentario: string | null;
  createdAt: Date;
  usuario: {
    id: string;
    nome: string;
    avatar: string | null;
  };
}

interface AvaliacoesSectionProps {
  eventoId: string;
  avaliacoes: Avaliacao[];
  total: number;
  media: number;
  distribuicao: { 1: number; 2: number; 3: number; 4: number; 5: number };
  minhaAvaliacao: { nota: number; comentario: string | null } | null;
  isLoggedIn: boolean;
  isInscrito: boolean;
}

export function AvaliacoesSection({ 
  eventoId, 
  avaliacoes, 
  total, 
  media, 
  distribuicao, 
  minhaAvaliacao, 
  isLoggedIn,
  isInscrito 
}: AvaliacoesSectionProps) {
  const [nota, setNota] = useState(minhaAvaliacao?.nota || 0);
  const [comentario, setComentario] = useState(minhaAvaliacao?.comentario || '');
  const [hoverNota, setHoverNota] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nota === 0) {
      setMessage({ type: 'error', text: 'Selecione uma nota' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId, nota, comentario })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Avaliacao enviada com sucesso!' });
        setShowForm(false);
        // Reload the page to show updated reviews
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao enviar avaliacao' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao enviar avaliacao' });
    }
    setLoading(false);
  };

  const StarRating = ({ rating, size = 20, interactive = false }: { rating: number; size?: number; interactive?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && setNota(star)}
          onMouseEnter={() => interactive && setHoverNota(star)}
          onMouseLeave={() => interactive && setHoverNota(0)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill={(interactive ? (hoverNota || nota) : rating) >= star ? "#FFD700" : "none"} 
            stroke="#FFD700" 
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      ))}
    </div>
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <h2 className="font-['DM_Sans'] text-[18px] sm:text-[20px] font-bold text-[#242565] mb-4 sm:mb-6">
        Avaliacoes do Evento
      </h2>

      {/* Resumo das avaliacoes */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
        {/* Media geral */}
        <div className="text-center sm:text-left">
          <div className="font-['DM_Sans'] text-[48px] sm:text-[56px] font-bold text-[#242565] leading-none">
            {media.toFixed(1)}
          </div>
          <StarRating rating={Math.round(media)} size={18} />
          <p className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] mt-1">
            {total} {total === 1 ? 'avaliacao' : 'avaliacoes'}
          </p>
        </div>

        {/* Distribuicao */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribuicao[star as keyof typeof distribuicao];
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="font-['DM_Sans'] text-[12px] sm:text-[13px] text-[#666] w-3">{star}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFD700] rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-['DM_Sans'] text-[12px] sm:text-[13px] text-[#666] w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botao para avaliar */}
      {isLoggedIn && isInscrito && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-[#f5f5ff] text-[#3d37f1] rounded-xl font-['DM_Sans'] text-[14px] font-medium hover:bg-[#eee1ff] transition mb-6"
        >
          {minhaAvaliacao ? 'Editar minha avaliacao' : 'Avaliar este evento'}
        </button>
      )}

      {!isLoggedIn && (
        <p className="text-center font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] mb-6">
          Faca login para avaliar este evento
        </p>
      )}

      {isLoggedIn && !isInscrito && (
        <p className="text-center font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] mb-6">
          Inscreva-se no evento para poder avaliar
        </p>
      )}

      {/* Formulario de avaliacao */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#f8f8ff] rounded-xl p-4 mb-6">
          <h3 className="font-['DM_Sans'] text-[15px] sm:text-[16px] font-medium text-[#333] mb-3">
            {minhaAvaliacao ? 'Editar avaliacao' : 'Sua avaliacao'}
          </h3>
          
          <div className="mb-4">
            <label className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] mb-2 block">
              Qual sua nota para este evento?
            </label>
            <StarRating rating={nota} size={32} interactive />
          </div>

          <div className="mb-4">
            <label className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] mb-2 block">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte sua experiencia no evento..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#3d37f1]"
              rows={3}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-4 font-['DM_Sans'] text-[13px] sm:text-[14px] ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 border border-gray-200 text-[#666] rounded-xl font-['DM_Sans'] text-[14px] font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || nota === 0}
              className="flex-1 py-3 bg-[#3d37f1] text-white rounded-xl font-['DM_Sans'] text-[14px] font-medium hover:bg-[#2d27e1] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar avaliacao'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de avaliacoes */}
      <div className="space-y-4">
        {avaliacoes.length > 0 ? (
          avaliacoes.slice(0, 5).map((avaliacao) => (
            <div key={avaliacao.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
              {avaliacao.usuario.avatar ? (
                <Image
                  src={avaliacao.usuario.avatar}
                  alt={avaliacao.usuario.nome}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#3d37f1] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {avaliacao.usuario.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['DM_Sans'] text-[14px] font-medium text-[#333]">
                    {avaliacao.usuario.nome}
                  </span>
                  <StarRating rating={avaliacao.nota} size={14} />
                </div>
                {avaliacao.comentario && (
                  <p className="font-['DM_Sans'] text-[13px] text-[#666] mb-1">
                    {avaliacao.comentario}
                  </p>
                )}
                <span className="font-['DM_Sans'] text-[11px] text-[#999]">
                  {formatDate(avaliacao.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center font-['DM_Sans'] text-[14px] text-[#666] py-4">
            Nenhuma avaliacao ainda. Seja o primeiro a avaliar!
          </p>
        )}
      </div>

      {avaliacoes.length > 5 && (
        <button className="w-full mt-4 py-3 text-[#3d37f1] font-['DM_Sans'] text-[14px] font-medium hover:bg-[#f5f5ff] rounded-xl transition">
          Ver todas as {total} avaliacoes
        </button>
      )}
    </div>
  );
}
