import { getEventosPaginados, getCurrentUser, getUserAvatar } from "@/app/actions";
import { EventosSection } from "@/app/components/EventosSection";
import { Header } from "@/app/components/Header";
import Link from "next/link";

export default async function Home() {
  const { eventos, total } = await getEventosPaginados({ limit: 9, offset: 0 });
  const user = await getCurrentUser();
  const userAvatar = await getUserAvatar();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative w-full min-h-[500px] sm:min-h-[600px] lg:h-[720px] bg-cover bg-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(9,6,94,0.8), rgba(9,6,94,0.8)), url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)',
          backgroundPosition: 'center'
        }}
      >
        <Header user={user} userAvatar={userAvatar} />
        
        {/* Hero Content */}
        <div className="absolute bottom-12 sm:bottom-20 lg:bottom-32 left-4 sm:left-6 lg:left-[225px] max-w-[90%] sm:max-w-[500px] px-2 sm:px-0">
          <h1 className="font-['DM_Sans'] text-2xl sm:text-3xl lg:text-[40px] font-bold text-white mb-3 sm:mb-4 text-balance">
            Crie e gerencie eventos em minutos
          </h1>
          <p className="font-['DM_Sans'] text-sm sm:text-base lg:text-[18px] text-white/90 mb-6 sm:mb-8">
            Plataforma completa para criar eventos, gerenciar participantes e receber inscricoes de forma simples.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/organizador"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-base sm:text-[18px] font-bold hover:bg-[#d4146d] transition shadow-lg text-center"
            >
              Criar meu evento
            </Link>
            <Link
              href="#eventos"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-full font-['DM_Sans'] text-base sm:text-[18px] font-bold hover:bg-white/10 transition text-center"
            >
              Saber mais
            </Link>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="max-w-[1086px] mx-auto -mt-16 sm:-mt-20 lg:-mt-24 relative z-20 px-4">
        <div className="bg-black rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <h2 className="font-['DM_Sans'] text-xl sm:text-2xl lg:text-[32px] font-bold text-white mb-4 sm:mb-6">
            Procurar um evento
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-1">
              <label className="font-['DM_Sans'] text-[12px] sm:text-[14px] text-white/70 mb-2 block">Escolha a categoria</label>
              <select className="w-full bg-transparent border-b border-white/30 text-white font-['DM_Sans'] text-base sm:text-[18px] font-bold py-2 focus:outline-none">
                <option value="" className="text-black">Todas</option>
                <option value="Tecnologia" className="text-black">Tecnologia</option>
                <option value="Saude" className="text-black">Saude</option>
                <option value="Negocios" className="text-black">Negocios</option>
                <option value="Educacao" className="text-black">Educacao</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="font-['DM_Sans'] text-[12px] sm:text-[14px] text-white/70 mb-2 block">Formato</label>
              <select className="w-full bg-transparent border-b border-white/30 text-white font-['DM_Sans'] text-base sm:text-[18px] font-bold py-2 focus:outline-none">
                <option value="" className="text-black">Todos</option>
                <option value="Presencial" className="text-black">Presencial</option>
                <option value="Online" className="text-black">Online</option>
                <option value="Hibrido" className="text-black">Hibrido</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="font-['DM_Sans'] text-[12px] sm:text-[14px] text-white/70 mb-2 block">Data</label>
              <input 
                type="date" 
                className="w-full bg-transparent border-b border-white/30 text-white font-['DM_Sans'] text-base sm:text-[18px] font-bold py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <EventosSection eventosIniciais={eventos} totalInicial={total} />

      {/* CTA Section */}
      <div className="w-full bg-[#eee1ff] py-10 sm:py-12 lg:py-16">
        <div className="max-w-[1086px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-6">
          <div className="max-w-[500px] text-center sm:text-left">
            <h2 className="font-['DM_Sans'] text-2xl sm:text-3xl lg:text-[34px] font-bold text-black mb-3 sm:mb-4">
              Faca seu proprio evento
            </h2>
            <p className="font-['DM_Sans'] text-base sm:text-[18px] text-[#272727]">
              Tudo que voce precisa para organizar eventos profissionais, sem dor de cabeca.
            </p>
          </div>
          <Link
            href="/organizador"
            className="px-8 sm:px-10 py-4 sm:py-5 bg-[#f5167e] text-white rounded-full font-['DM_Sans'] text-base sm:text-[18px] font-bold hover:bg-[#d4146d] transition shadow-lg"
          >
            Criar meu evento
          </Link>
        </div>
      </div>

      {/* Blog Section */}
      <div className="max-w-[1086px] mx-auto py-10 sm:py-12 lg:py-16 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-['DM_Sans'] text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#242565] mb-3 sm:mb-4">
            Blog
          </h2>
          <p className="font-['DM_Sans'] text-base sm:text-[18px] text-[#6a6a6a]">
            Acompanhe submissoes em tempo real com o MeetFlow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              titulo: 'Como organizar um evento de sucesso do zero',
              descricao: 'Aprenda o passo a passo para planejar, divulgar e executar seu evento sem erros.',
              imagem: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
            },
            {
              titulo: '5 formas de aumentar as inscricoes do seu evento',
              descricao: 'Descubra estrategias simples para atrair mais participantes.',
              imagem: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
            },
            {
              titulo: 'Eventos online vs presenciais: qual escolher?',
              descricao: 'Veja as vantagens de cada formato e qual faz mais sentido para voce.',
              imagem: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80',
            },
          ].map((post, i) => (
            <div key={i} className="group cursor-pointer">
              <div 
                className="w-full h-[180px] sm:h-[210px] rounded-2xl bg-cover bg-center mb-4 group-hover:shadow-lg transition"
                style={{ backgroundImage: `url(${post.imagem})` }}
              />
              <h3 className="font-['DM_Sans'] text-lg sm:text-[20px] font-bold text-[#242565] mb-2 group-hover:text-[#3d37f1] transition">
                {post.titulo}
              </h3>
              <p className="font-['DM_Sans'] text-sm sm:text-[16px] text-black mb-2">
                {post.descricao}
              </p>
              <span className="font-['DM_Sans'] text-[12px] sm:text-[14px] text-[#a4a4a4]">
                12 Mar - Jhon Doe
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#3d37f1] text-[#3d37f1] rounded-full font-['DM_Sans'] text-base sm:text-[18px] font-bold hover:bg-[#3d37f1] hover:text-white transition">
            Carregar mais
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#09065e] py-10 sm:py-12 lg:py-16">
        <div className="max-w-[1086px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 mb-8 lg:mb-12">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/XeO8pD1v2m.png)] bg-cover" />
                <span className="font-['DM_Sans'] text-2xl sm:text-[28px] font-extrabold text-white">
                  Meet<span className="font-normal">flow</span>
                </span>
              </div>
              <p className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-white/70 max-w-[300px]">
                Meetflow e uma plataforma de criacao e gerenciamento de eventos. Planejar eventos incriveis nunca foi tao facil.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-20 w-full lg:w-auto">
              <div>
                <h4 className="font-['DM_Sans'] text-base sm:text-[18px] font-bold text-white mb-3 sm:mb-4">Planejar Eventos</h4>
                <ul className="space-y-2">
                  <li><Link href="/organizador" className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-white/70 hover:text-white">Criar Evento</Link></li>
                  <li><Link href="/home" className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-white/70 hover:text-white">Explorar Eventos</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-['DM_Sans'] text-base sm:text-[18px] font-bold text-white mb-3 sm:mb-4">Empresa</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-white/70 hover:text-white">Sobre nos</a></li>
                  <li><a href="#" className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-white/70 hover:text-white">Contato</a></li>
                  <li><a href="#" className="font-['DM_Sans'] text-[13px] sm:text-[14px] text-white/70 hover:text-white">Suporte</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-['DM_Sans'] text-base sm:text-[18px] font-bold text-white mb-3 sm:mb-4">Redes Sociais</h4>
                <div className="flex gap-3 sm:gap-4">
                  <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 sm:pt-8 text-center">
            <p className="font-['DM_Sans'] text-[12px] sm:text-[14px] text-white/50">
              2026 MeetFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
