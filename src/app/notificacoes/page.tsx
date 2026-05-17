import { getNotificacoes, getCurrentUser, marcarNotificacaoComoLida, marcarTodasComoLidas } from "@/app/actions";
import { Header } from "@/app/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function NotificacoesPage() {
  const user = await getCurrentUser();
  
  if (!user) redirect('/login?redirect=/notificacoes');

  const notificacoes = await getNotificacoes();

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'INSCRICAO':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        );
      case 'LEMBRETE':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        );
      case 'MISSAO':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        );
      case 'MISSAO_PENDENTE':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
      case 'CERTIFICADO':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5167e" strokeWidth="2">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  const formatarData = (data: Date) => {
    const agora = new Date();
    const dataNotif = new Date(data);
    const diff = agora.getTime() - dataNotif.getTime();
    const minutos = Math.floor(diff / (1000 * 60));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutos < 60) return `${minutos} minutos atrás`;
    if (horas < 24) return `${horas} horas atrás`;
    if (dias === 1) return 'Ontem';
    if (dias < 7) return `${dias} dias atrás`;
    return dataNotif.toLocaleDateString('pt-BR');
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  async function handleMarcarLida(notificacaoId: string) {
    'use server';
    await marcarNotificacaoComoLida(notificacaoId);
    revalidatePath('/notificacoes');
  }

  async function handleMarcarTodas() {
    'use server';
    await marcarTodasComoLidas();
    revalidatePath('/notificacoes');
  }

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
            Notificações
          </h1>
          <p className="font-['DM_Sans'] text-[18px] text-white/80">
            {naoLidas > 0 ? `Você tem ${naoLidas} notificação(ões) não lida(s)` : 'Todas as notificações foram lidas'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto py-12 px-4">
        {notificacoes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <h2 className="font-['DM_Sans'] text-[24px] font-bold text-[#242565] mb-2">
              Nenhuma notificação
            </h2>
            <p className="font-['DM_Sans'] text-[16px] text-[#666] mb-6">
              Inscreva-se em eventos para receber notificações sobre lembretes e missões
            </p>
            <Link
              href="/home"
              className="inline-block px-8 py-4 bg-[#3d37f1] text-white rounded-full font-['DM_Sans'] text-[16px] font-bold hover:bg-[#2d27e1] transition"
            >
              Explorar eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Ações em lote */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-['DM_Sans'] text-[14px] text-[#666]">
                {notificacoes.length} notificação(ões)
              </span>
              {naoLidas > 0 && (
                <form action={handleMarcarTodas}>
                  <button 
                    type="submit"
                    className="font-['DM_Sans'] text-[14px] text-[#3d37f1] hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                </form>
              )}
            </div>

            {/* Lista de notificações */}
            {notificacoes.map((notificacao) => (
              <div 
                key={notificacao.id} 
                className={`bg-white rounded-xl p-4 border transition hover:shadow-md ${
                  notificacao.lida ? 'border-gray-100' : 'border-[#3d37f1]/30 bg-[#f5f5ff]/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    notificacao.lida ? 'bg-gray-100' : 'bg-[#f5f5ff]'
                  }`}>
                    {getIcone(notificacao.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-['DM_Sans'] text-[16px] font-bold text-[#242565]">
                        {notificacao.titulo}
                      </h3>
                      {!notificacao.lida && (
                        <span className="w-2 h-2 bg-[#3d37f1] rounded-full" />
                      )}
                    </div>
                    <p className="font-['DM_Sans'] text-[14px] text-[#666] mb-2">
                      {notificacao.mensagem}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="font-['DM_Sans'] text-[12px] text-[#999]">
                        {formatarData(notificacao.createdAt)}
                      </span>
                      {notificacao.evento && (
                        <Link 
                          href={`/eventos/${notificacao.eventoId}`}
                          className="font-['DM_Sans'] text-[12px] text-[#3d37f1] hover:underline"
                        >
                          Ver evento
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notificacao.lida && (
                    <form action={handleMarcarLida.bind(null, notificacao.id)}>
                      <button 
                        type="submit"
                        className="text-[#666] hover:text-[#333] p-2"
                        title="Marcar como lida"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
