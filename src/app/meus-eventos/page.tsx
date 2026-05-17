import { getMeusEventos, getCurrentUser } from "@/app/actions";
import { Header } from "@/app/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MeusEventosPage() {
  const user = await getCurrentUser();
  
  if (!user) redirect('/login?redirect=/meus-eventos');

  const inscricoes = await getMeusEventos();

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative w-full h-[300px] bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(135deg, #09065e 0%, #1a1a4e 100%)' }}
      >
        <Header user={user} />
        
        <div className="absolute bottom-12 left-[225px]">
          <h1 className="font-['DM_Sans'] text-[40px] font-bold text-white">
            Meus Ingressos
          </h1>
          <p className="font-['DM_Sans'] text-[18px] text-white/80">
            Acompanhe seus eventos inscritos, missões e certificados
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1086px] mx-auto py-12 px-4">
        {inscricoes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2 className="font-['DM_Sans'] text-[24px] font-bold text-[#242565] mb-2">
              Nenhum ingresso encontrado
            </h2>
            <p className="font-['DM_Sans'] text-[16px] text-[#666] mb-6">
              Explore os eventos disponíveis e inscreva-se para começar
            </p>
            <Link
              href="/home"
              className="inline-block px-8 py-4 bg-[#3d37f1] text-white rounded-full font-['DM_Sans'] text-[16px] font-bold hover:bg-[#2d27e1] transition"
            >
              Explorar eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {inscricoes.map((inscricao) => {
              const evento = inscricao.evento;
              const dataInicio = new Date(evento.dataInicio);
              const totalMissoes = inscricao.progressos.length;
              const missoesConcluidas = inscricao.progressos.filter(p => p.concluida).length;
              const progressoTotal = totalMissoes > 0 ? (missoesConcluidas / totalMissoes) * 100 : 0;
              const pontosGanhos = inscricao.progressos.filter(p => p.concluida).reduce((acc, p) => acc + p.missao.pontos, 0);

              return (
                <div key={inscricao.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Event Header */}
                  <div 
                    className="relative h-[200px] bg-cover bg-center"
                    style={{ 
                      backgroundImage: evento.banner 
                        ? `linear-gradient(rgba(9,6,94,0.7), rgba(9,6,94,0.7)), url(${evento.banner})`
                        : 'linear-gradient(135deg, #09065e 0%, #1a1a4e 100%)'
                    }}
                  >
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 bg-[#f5167e] rounded-lg font-['DM_Sans'] text-[12px] text-white mb-2">
                          {evento.tipo}
                        </span>
                        <h2 className="font-['DM_Sans'] text-[24px] font-bold text-white">
                          {evento.nome}
                        </h2>
                        <p className="font-['DM_Sans'] text-[14px] text-white/80">
                          {dataInicio.getDate()} {meses[dataInicio.getMonth()]} {dataInicio.getFullYear()} - {evento.localizacao}
                        </p>
                      </div>
                      <Link
                        href={`/eventos/${evento.id}`}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-['DM_Sans'] text-[14px] hover:bg-white/30 transition"
                      >
                        Ver evento
                      </Link>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex gap-8">
                      {/* Programação */}
                      <div className="flex-1">
                        <h3 className="font-['DM_Sans'] text-[18px] font-bold text-[#242565] mb-4">
                          Programação
                        </h3>
                        {evento.programacoes.length > 0 ? (
                          <div className="space-y-3">
                            {evento.programacoes.slice(0, 3).map((prog) => (
                              <div key={prog.id} className="flex items-center gap-3 p-3 bg-[#f8f8ff] rounded-xl">
                                <div className="w-10 h-10 bg-[#3d37f1] rounded-lg flex items-center justify-center">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-['DM_Sans'] text-[14px] font-medium text-[#333]">{prog.titulo}</p>
                                  <p className="font-['DM_Sans'] text-[12px] text-[#666]">{prog.horario}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-['DM_Sans'] text-[14px] text-[#666]">
                            Programação a ser definida
                          </p>
                        )}
                      </div>

                      {/* Missões */}
                      <div className="flex-1">
                        <h3 className="font-['DM_Sans'] text-[18px] font-bold text-[#242565] mb-4">
                          Missões do Evento
                        </h3>
                        {inscricao.progressos.length > 0 ? (
                          <div className="space-y-3">
                            {inscricao.progressos.map((progresso) => (
                              <div key={progresso.id} className="flex items-center gap-3 p-3 bg-[#f8f8ff] rounded-xl">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${progresso.concluida ? 'bg-[#10b981]' : 'bg-[#eee1ff]'}`}>
                                  {progresso.concluida ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                  ) : (
                                    <span className="text-lg">{progresso.missao.icone || '🎯'}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-['DM_Sans'] text-[14px] font-medium text-[#333]">
                                    {progresso.missao.titulo}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                      <div 
                                        className={`h-full rounded-full ${progresso.concluida ? 'bg-[#10b981]' : 'bg-[#3d37f1]'}`}
                                        style={{ width: `${(progresso.progresso / progresso.missao.meta) * 100}%` }}
                                      />
                                    </div>
                                    <span className="font-['DM_Sans'] text-[12px] text-[#666]">
                                      {progresso.progresso}/{progresso.missao.meta}
                                    </span>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${progresso.concluida ? 'bg-[#10b981] text-white' : 'bg-[#3d37f1] text-white'}`}>
                                  {progresso.missao.pontos} pts
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-['DM_Sans'] text-[14px] text-[#666]">
                            Nenhuma missão disponível
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Footer */}
                    {totalMissoes > 0 && (
                      <div className="mt-6 p-4 bg-[#eee1ff] rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-['DM_Sans'] text-[14px] text-[#333]">Progresso total</p>
                            <p className="font-['DM_Sans'] text-[24px] font-bold text-[#3d37f1]">
                              {progressoTotal.toFixed(0)}%
                            </p>
                          </div>
                          <div className="w-px h-12 bg-[#d4c6ff]" />
                          <div>
                            <p className="font-['DM_Sans'] text-[14px] text-[#333]">Pontos ganhos</p>
                            <p className="font-['DM_Sans'] text-[24px] font-bold text-[#3d37f1]">
                              {pontosGanhos}
                            </p>
                          </div>
                        </div>
                        {progressoTotal >= 100 && (
                          <button className="px-6 py-3 bg-[#3d37f1] text-white rounded-full font-['DM_Sans'] text-[14px] font-bold hover:bg-[#2d27e1] transition">
                            Ver meu certificado
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="w-full bg-[#eee1ff] py-12 mt-12">
        <div className="max-w-[1086px] mx-auto flex items-center justify-between px-4">
          <div>
            <h2 className="font-['DM_Sans'] text-[34px] font-bold text-[#000] mb-2">
              Faça seu próprio evento
            </h2>
            <p className="font-['DM_Sans'] text-[18px] text-[#272727]">
              Tudo que você precisa para organizar eventos profissionais, sem dor de cabeça.
            </p>
          </div>
          <Link
            href="/organizador"
            className="px-8 py-4 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-[18px] font-bold hover:bg-[#d4146d] transition"
          >
            Criar meu evento
          </Link>
        </div>
      </div>
    </div>
  );
}
