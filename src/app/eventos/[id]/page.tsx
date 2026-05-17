import { getEvento, verificarInscricao, inscreverEvento, getCurrentUser, getUserAvatar, getAvaliacoesEvento, getMinhaAvaliacao } from "@/app/actions";
import { Header } from "@/app/components/Header";
import { AvaliacoesSection } from "@/app/components/AvaliacoesSection";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function EventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const evento = await getEvento(id);
  
  if (!evento) notFound();

  const user = await getCurrentUser();
  const userAvatar = await getUserAvatar();
  const jaInscrito = user ? await verificarInscricao(id) : false;
  const totalInscritos = evento._count.inscricoes;
  
  // Buscar avaliacoes
  const { avaliacoes, total: totalAvaliacoes, media, distribuicao } = await getAvaliacoesEvento(id);
  const minhaAvaliacao = await getMinhaAvaliacao(id);

  const meses = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dataInicio = new Date(evento.dataInicio);
  const dataFim = new Date(evento.dataTermino);

  async function handleInscrever() {
    'use server';
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect(`/login?redirect=/eventos/${id}`);
    
    const result = await inscreverEvento(id);
    if (result.requireAuth) {
      redirect(`/login?redirect=/eventos/${id}`);
    }
    redirect(`/eventos/${id}`);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative w-full min-h-[280px] sm:min-h-[350px] lg:h-[400px] bg-cover bg-center"
        style={{ 
          backgroundImage: evento.banner 
            ? `linear-gradient(rgba(9,6,94,0.85), rgba(9,6,94,0.85)), url(${evento.banner})`
            : 'linear-gradient(135deg, #09065e 0%, #1a1a4e 100%)'
        }}
      >
        <Header user={user} userAvatar={userAvatar} />
        
        <div className="absolute bottom-6 sm:bottom-10 lg:bottom-12 left-4 sm:left-6 lg:left-[225px] right-4 sm:right-6 lg:right-auto">
          <h1 className="font-['DM_Sans'] text-2xl sm:text-3xl lg:text-[40px] font-bold text-white mb-2 text-balance">
            {evento.nome}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f5167e] rounded-lg font-['DM_Sans'] text-[12px] sm:text-[14px] font-medium text-white">
              {evento.tipo}
            </span>
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-lg font-['DM_Sans'] text-[12px] sm:text-[14px] font-medium text-white">
              {evento.formato}
            </span>
            {evento.pago ? (
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#10b981] rounded-lg font-['DM_Sans'] text-[12px] sm:text-[14px] font-medium text-white">
                R$ {evento.valor?.toFixed(2)}
              </span>
            ) : (
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#10b981] rounded-lg font-['DM_Sans'] text-[12px] sm:text-[14px] font-medium text-white">
                Gratuito
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1086px] mx-auto py-6 sm:py-8 lg:py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-[60px] h-[70px] bg-[#f5f5ff] rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="font-['DM_Sans'] text-[14px] font-bold text-[#3d37f1]">
                    {dataInicio.getDate()}
                  </span>
                  <span className="font-['DM_Sans'] text-[12px] text-[#3d37f1]">
                    {meses[dataInicio.getMonth()].slice(0, 3)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-['DM_Sans'] text-[14px] sm:text-[16px] text-[#333] mb-1">
                    <span className="font-bold">{dataInicio.getDate()} {meses[dataInicio.getMonth()]} {dataInicio.getFullYear()}</span>
                    {' '}ate{' '}
                    <span className="font-bold">{dataFim.getDate()} {meses[dataFim.getMonth()]} {dataFim.getFullYear()}</span>
                  </p>
                  <div className="flex items-center gap-2 text-[#666] mb-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="font-['DM_Sans'] text-[13px] sm:text-[14px]">{evento.localizacao}</span>
                  </div>
                  {evento.endereco && (
                    <div className="flex items-center gap-2 text-[#666]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="font-['DM_Sans'] text-[13px] sm:text-[14px]">{evento.endereco}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(media) ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                    <span className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] ml-1">
                      {media.toFixed(1)} ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliacao' : 'avaliacoes'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sobre o evento */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-['DM_Sans'] text-[18px] sm:text-[20px] font-bold text-[#242565] mb-3">Sobre o evento</h2>
              <p className="font-['DM_Sans'] text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                {evento.descricao}
              </p>
            </div>

            {/* Imagem do evento */}
            {evento.banner && (
              <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden relative h-[200px] sm:h-[300px]">
                <Image 
                  src={evento.banner} 
                  alt={evento.nome}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Programacao */}
            {evento.programacoes.length > 0 && (
              <div className="bg-[#f8f8ff] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="font-['DM_Sans'] text-[18px] sm:text-[20px] font-bold text-[#242565] mb-4">Programacao</h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                  {evento.programacoes.map((prog, i) => (
                    <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full font-['DM_Sans'] text-[12px] sm:text-[14px] text-[#333] border border-gray-200">
                      {new Date(prog.dia).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  ))}
                </div>
                {evento.programacoes.map((prog, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#333]">{prog.horario} - {prog.titulo}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tipos de Ingresso */}
            {evento.tiposIngresso && evento.tiposIngresso.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
                <h2 className="font-['DM_Sans'] text-[18px] sm:text-[20px] font-bold text-[#242565] mb-4">Ingressos</h2>
                <div className="space-y-3">
                  {evento.tiposIngresso.map((ingresso) => (
                    <div key={ingresso.id} className="flex items-center justify-between p-3 sm:p-4 bg-[#f8f8ff] rounded-xl">
                      <div>
                        <p className="font-['DM_Sans'] text-[14px] sm:text-[16px] font-medium text-[#333]">{ingresso.nome}</p>
                        {ingresso.quantidade && (
                          <p className="font-['DM_Sans'] text-[11px] sm:text-[12px] text-[#666]">
                            {ingresso.quantidade} disponiveis
                          </p>
                        )}
                      </div>
                      <span className="font-['DM_Sans'] text-[16px] sm:text-[18px] font-bold text-[#3d37f1]">
                        {ingresso.preco === 0 ? 'Gratuito' : `R$ ${ingresso.preco.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avaliacoes */}
            <div className="mb-6 sm:mb-8">
              <AvaliacoesSection 
                eventoId={id}
                avaliacoes={avaliacoes}
                total={totalAvaliacoes}
                media={media}
                distribuicao={distribuicao}
                minhaAvaliacao={minhaAvaliacao}
                isLoggedIn={!!user}
                isInscrito={jaInscrito}
              />
            </div>

            {/* Missoes */}
            {evento.missoes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
                <h2 className="font-['DM_Sans'] text-[18px] sm:text-[20px] font-bold text-[#242565] mb-2">Missoes do Evento</h2>
                <p className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#666] mb-4">
                  Complete atividades para obter pontos e receba seu certificado de acordo com sua pontuacao.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  {evento.missoes.map((missao) => (
                    <div key={missao.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-[#f8f8ff] rounded-xl">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#eee1ff] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-base sm:text-lg">{missao.icone || '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-['DM_Sans'] text-[13px] sm:text-[14px] font-medium text-[#333]">{missao.titulo}</p>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                          <div className="h-full bg-[#3d37f1] rounded-full" style={{ width: '0%' }} />
                        </div>
                      </div>
                      <span className="px-2 sm:px-3 py-1 bg-[#3d37f1] text-white rounded-full text-[11px] sm:text-[12px] font-medium flex-shrink-0">
                        {missao.pontos} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizadores */}
            {evento.organizadores && evento.organizadores.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="font-['DM_Sans'] text-[18px] sm:text-[20px] font-bold text-[#242565] mb-4">Organizadores</h2>
                <div className="space-y-3">
                  {evento.organizadores.map((org) => (
                    <div key={org.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-[#f8f8ff] rounded-xl">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3d37f1] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-base sm:text-lg">
                          {org.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-['DM_Sans'] text-[13px] sm:text-[14px] font-medium text-[#333]">{org.nome}</p>
                        <p className="font-['DM_Sans'] text-[11px] sm:text-[12px] text-[#666] truncate">{org.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Card */}
          <div className="w-full lg:w-[320px] order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 lg:sticky lg:top-6">
              <button className="flex items-center gap-2 text-[#666] mb-4 hover:text-[#333] w-full justify-center lg:justify-start">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <span className="font-['DM_Sans'] text-[14px]">Compartilhar evento</span>
              </button>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-[#666] mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="font-['DM_Sans'] text-[14px]">
                  {evento.horarioInicio || '08:00'} ate {evento.horarioFim || '18:00'}
                </span>
              </div>

              <div className="mb-4 p-3 bg-[#f5f5ff] rounded-xl">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span className="font-['DM_Sans'] text-[14px] text-[#666]">Inscritos: </span>
                  <span className="font-['DM_Sans'] text-[16px] font-bold text-[#3d37f1]">{totalInscritos}</span>
                </div>
              </div>

              {evento.pago && evento.valor && (
                <div className="mb-4 text-center lg:text-left">
                  <span className="font-['DM_Sans'] text-[24px] font-bold text-[#242565]">
                    R$ {evento.valor.toFixed(2)}
                  </span>
                </div>
              )}

              {jaInscrito ? (
                <Link
                  href="/meus-eventos"
                  className="w-full py-3 sm:py-4 bg-[#10b981] text-white rounded-full font-['DM_Sans'] text-[14px] sm:text-[16px] font-bold flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Inscrito - Ver detalhes
                </Link>
              ) : user ? (
                <form action={handleInscrever}>
                  <button
                    type="submit"
                    className="w-full py-3 sm:py-4 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-[14px] sm:text-[16px] font-bold flex items-center justify-center gap-2 hover:bg-[#d4146d] transition"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {evento.pago ? 'Comprar ingresso' : 'Inscrever-se gratuitamente'}
                  </button>
                </form>
              ) : (
                <Link
                  href={`/login?redirect=/eventos/${id}`}
                  className="w-full py-3 sm:py-4 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-[14px] sm:text-[16px] font-bold flex items-center justify-center gap-2 hover:bg-[#d4146d] transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Fazer login para inscrever-se
                </Link>
              )}

              <p className="text-center mt-3 font-['DM_Sans'] text-[11px] sm:text-[12px] text-[#999]">
                Ao se inscrever, voce concorda com os termos do evento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-[#eee1ff] py-8 sm:py-10 lg:py-12 mt-8 sm:mt-12">
        <div className="max-w-[1086px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <h2 className="font-['DM_Sans'] text-2xl sm:text-[34px] font-bold text-[#000] mb-2">
              Faca seu proprio evento
            </h2>
            <p className="font-['DM_Sans'] text-[16px] sm:text-[18px] text-[#272727]">
              Tudo que voce precisa para organizar eventos profissionais, sem dor de cabeca.
            </p>
          </div>
          <Link
            href="/organizador"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-[16px] sm:text-[18px] font-bold hover:bg-[#d4146d] transition"
          >
            Criar meu evento
          </Link>
        </div>
      </div>
    </div>
  );
}
