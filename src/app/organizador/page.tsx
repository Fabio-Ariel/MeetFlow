import { getCurrentUser, getMeusEventosCriados } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrganizadorPage() {
  const user = await getCurrentUser();
  
  if (!user) redirect('/login?redirect=/organizador');

  const eventosGerenciados = await getMeusEventosCriados();
  const userName = user.user_metadata?.nome || user.email?.split('@')[0] || 'Organizador';

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-[#1a1040] py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-[36px] h-[42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/V93Zw7LcAT.png)] bg-cover bg-no-repeat" />
            <span className="font-['DM_Sans'] text-[28px] font-extrabold text-white">
              Meet<span className="font-normal">flow</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/home"
              className="font-['DM_Sans'] text-[14px] text-white/80 hover:text-white transition"
            >
              Voltar para Home
            </Link>
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center">
              <span className="text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-12 px-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['DM_Sans'] text-[32px] font-bold text-[#1a1040] mb-2">
              Olá, {userName}!
            </h1>
            <p className="font-['DM_Sans'] text-[16px] text-[#666]">
              Gerencie seus eventos ou crie um novo
            </p>
          </div>
          <Link
            href="/organizador/criar"
            className="px-8 py-4 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-[16px] font-bold hover:bg-[#d4146d] transition flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Criar novo evento
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#eee1ff] rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="font-['DM_Sans'] text-[14px] text-[#666]">Eventos criados</p>
                <p className="font-['DM_Sans'] text-[32px] font-bold text-[#1a1040]">
                  {eventosGerenciados.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#d4f8e8] rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <p className="font-['DM_Sans'] text-[14px] text-[#666]">Total de inscritos</p>
                <p className="font-['DM_Sans'] text-[32px] font-bold text-[#1a1040]">
                  {eventosGerenciados.reduce((acc, e) => acc + e._count.inscricoes, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#fff3cd] rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="font-['DM_Sans'] text-[14px] text-[#666]">Eventos ativos</p>
                <p className="font-['DM_Sans'] text-[32px] font-bold text-[#1a1040]">
                  {eventosGerenciados.filter(e => e.status === 'publicado').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-['DM_Sans'] text-[20px] font-bold text-[#1a1040]">
              Meus Eventos
            </h2>
          </div>

          {eventosGerenciados.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="font-['DM_Sans'] text-[18px] font-bold text-[#1a1040] mb-2">
                Nenhum evento criado ainda
              </h3>
              <p className="font-['DM_Sans'] text-[14px] text-[#666] mb-6">
                Comece criando seu primeiro evento agora mesmo
              </p>
              <Link
                href="/organizador/criar"
                className="inline-block px-8 py-4 bg-[#3d37f1] text-white rounded-full font-['DM_Sans'] text-[16px] font-bold hover:bg-[#2d27e1] transition"
              >
                Criar meu primeiro evento
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {eventosGerenciados.map((evento) => {
                const dataInicio = new Date(evento.dataInicio);
                const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

                return (
                  <div key={evento.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl bg-cover bg-center"
                        style={{ 
                          backgroundImage: evento.banner 
                            ? `url(${evento.banner})`
                            : 'linear-gradient(135deg, #3d37f1 0%, #6c5ce7 100%)'
                        }}
                      />
                      <div>
                        <h3 className="font-['DM_Sans'] text-[16px] font-bold text-[#1a1040]">
                          {evento.nome}
                        </h3>
                        <p className="font-['DM_Sans'] text-[14px] text-[#666]">
                          {dataInicio.getDate()} {meses[dataInicio.getMonth()]} {dataInicio.getFullYear()} - {evento.localizacao}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                            evento.status === 'publicado' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {evento.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                          </span>
                          <span className="text-[12px] text-[#666]">
                            {evento._count.inscricoes} inscritos
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/eventos/${evento.id}`}
                        className="p-2 text-[#666] hover:text-[#3d37f1] hover:bg-[#f5f5ff] rounded-lg transition"
                        title="Visualizar"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>
                      <Link
                        href={`/organizador/editar/${evento.id}`}
                        className="p-2 text-[#666] hover:text-[#3d37f1] hover:bg-[#f5f5ff] rounded-lg transition"
                        title="Editar"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
