import Link from "next/link";
import Image from "next/image";

interface EventoCardProps {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  banner?: string | null;
  localizacao?: string;
  formato?: string;
  pago?: boolean;
  valor?: number | null;
}

export function EventoCard({ id, nome, descricao, dataInicio, banner, localizacao, formato, pago, valor }: EventoCardProps) {
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const date = new Date(dataInicio);
  const mes = meses[date.getMonth()];
  const dia = date.getDate().toString().padStart(2, '0');

  const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80';
  const bgImage = banner || defaultImage;

  return (
    <Link href={`/eventos/${id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Imagem do evento */}
        <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden">
          <Image 
            src={bgImage}
            alt={nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Badge de formato */}
          {formato && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[#3d37f1] text-white text-[11px] font-medium rounded-full">
              {formato}
            </span>
          )}
          {/* Badge de preco */}
          <span className="absolute top-3 right-3 px-3 py-1 bg-white text-[#333] text-[11px] font-bold rounded-full shadow">
            {pago && valor ? `R$ ${valor.toFixed(2)}` : 'Gratuito'}
          </span>
        </div>
        
        {/* Conteudo */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex gap-3 mb-3">
            {/* Data */}
            <div className="flex flex-col items-center justify-center bg-[#f5f5ff] rounded-lg px-3 py-2 min-w-[50px]">
              <span className="font-['DM_Sans'] text-[11px] font-bold text-[#3d37f1] uppercase">
                {mes}
              </span>
              <span className="font-['DM_Sans'] text-[22px] font-bold text-[#242565] leading-none">
                {dia}
              </span>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-['DM_Sans'] text-[15px] sm:text-[16px] font-bold text-[#242565] mb-1 line-clamp-2 group-hover:text-[#3d37f1] transition-colors">
                {nome}
              </h3>
              {localizacao && (
                <div className="flex items-center gap-1 text-[#666]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="font-['DM_Sans'] text-[12px] truncate">{localizacao}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Descricao */}
          <p className="font-['DM_Sans'] text-[13px] text-[#6a6a6a] line-clamp-2 flex-1">
            {descricao}
          </p>
          
          {/* CTA */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="font-['DM_Sans'] text-[13px] font-medium text-[#3d37f1] group-hover:text-[#f5167e] transition-colors flex items-center gap-1">
              Ver detalhes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
