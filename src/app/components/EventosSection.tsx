'use client';

import { useState, useEffect } from 'react';
import { EventoCard } from './EventoCard';
import Link from 'next/link';

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  banner: string | null;
  area: string;
  formato: string;
  localizacao?: string;
  pago?: boolean;
  valor?: number | null;
}

interface EventosSectionProps {
  eventosIniciais: Evento[];
  totalInicial: number;
}

export function EventosSection({ eventosIniciais, totalInicial }: EventosSectionProps) {
  const [eventos, setEventos] = useState<Evento[]>(eventosIniciais);
  const [total, setTotal] = useState(totalInicial);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(9);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  
  // Filtros
  const [categoria, setCategoria] = useState('');
  const [formato, setFormato] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [busca, setBusca] = useState('');

  const totalPages = Math.ceil(total / itemsPerPage);
  const hasMore = offset < total;

  const aplicarFiltros = async (resetPage = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria) params.set('categoria', categoria);
      if (formato) params.set('formato', formato);
      if (busca) params.set('busca', busca);
      params.set('offset', '0');
      params.set('limit', '9');

      const response = await fetch(`/api/eventos?${params.toString()}`);
      const data = await response.json();
      
      setEventos(data.eventos);
      setTotal(data.total);
      setOffset(9);
      if (resetPage) setPage(1);
    } catch (error) {
      console.error('Erro ao filtrar eventos:', error);
    }
    setLoading(false);
  };

  const carregarMais = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria) params.set('categoria', categoria);
      if (formato) params.set('formato', formato);
      if (busca) params.set('busca', busca);
      params.set('offset', offset.toString());
      params.set('limit', '9');

      const response = await fetch(`/api/eventos?${params.toString()}`);
      const data = await response.json();
      
      setEventos(prev => [...prev, ...data.eventos]);
      setOffset(prev => prev + 9);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao carregar mais eventos:', error);
    }
    setLoading(false);
  };

  const irParaPagina = async (newPage: number) => {
    setLoading(true);
    try {
      const newOffset = (newPage - 1) * itemsPerPage;
      const params = new URLSearchParams();
      if (categoria) params.set('categoria', categoria);
      if (formato) params.set('formato', formato);
      if (busca) params.set('busca', busca);
      params.set('offset', newOffset.toString());
      params.set('limit', itemsPerPage.toString());

      const response = await fetch(`/api/eventos?${params.toString()}`);
      const data = await response.json();
      
      setEventos(data.eventos);
      setTotal(data.total);
      setOffset(newOffset + itemsPerPage);
      setPage(newPage);
      
      // Scroll to top of events section
      document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao carregar pagina:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [categoria, formato]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    aplicarFiltros();
  };

  const limparFiltros = () => {
    setCategoria('');
    setFormato('');
    setBusca('');
    setPeriodo('');
  };

  return (
    <div id="eventos" className="max-w-[1086px] mx-auto py-10 sm:py-12 lg:py-16 px-4">
      {/* Header da secao */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className="font-['DM_Sans'] text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#242565]">
          Proximos eventos
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#f2f4ff] rounded-full font-['DM_Sans'] text-[12px] sm:text-[14px] text-[#1c265e] font-medium cursor-pointer"
          >
            <option value="">Periodo</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="ano">Este ano</option>
          </select>
          <select 
            value={formato}
            onChange={(e) => setFormato(e.target.value)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#f2f4ff] rounded-full font-['DM_Sans'] text-[12px] sm:text-[14px] text-[#1c265e] font-medium cursor-pointer"
          >
            <option value="">Formato</option>
            <option value="Presencial">Presencial</option>
            <option value="Online">Online</option>
            <option value="Hibrido">Hibrido</option>
          </select>
          <select 
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#f2f4ff] rounded-full font-['DM_Sans'] text-[12px] sm:text-[14px] text-[#1c265e] font-medium cursor-pointer"
          >
            <option value="">Categoria</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Saude">Saude</option>
            <option value="Negocios">Negocios</option>
            <option value="Educacao">Educacao</option>
            <option value="Cultura">Cultura</option>
            <option value="Esportes">Esportes</option>
          </select>
        </div>
      </div>

      {/* Barra de busca */}
      <form onSubmit={handleBusca} className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar eventos por nome ou descricao..."
              className="w-full px-4 sm:px-6 py-3 bg-[#f2f4ff] rounded-full font-['DM_Sans'] text-[13px] sm:text-[14px] text-[#1c265e] placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#3d37f1]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#3d37f1] hover:bg-[#3d37f1]/10 rounded-full transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
          {(categoria || formato || busca) && (
            <button
              type="button"
              onClick={limparFiltros}
              className="px-4 sm:px-6 py-3 text-[#666] hover:text-[#333] font-['DM_Sans'] text-[13px] sm:text-[14px] transition bg-gray-100 rounded-full sm:bg-transparent"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </form>

      {loading && eventos.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#3d37f1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-['DM_Sans'] text-[14px] sm:text-[16px] text-[#666]">Carregando eventos...</p>
        </div>
      ) : eventos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {eventos.map((evento) => (
              <EventoCard
                key={evento.id}
                id={evento.id}
                nome={evento.nome}
                descricao={evento.descricao}
                dataInicio={evento.dataInicio}
                banner={evento.banner}
                localizacao={evento.localizacao}
                formato={evento.formato}
                pago={evento.pago}
                valor={evento.valor}
              />
            ))}
          </div>

          {/* Paginacao */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-12">
            {/* Botoes de pagina */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => irParaPagina(page - 1)}
                disabled={page === 1 || loading}
                className="p-2 rounded-full border border-gray-200 text-[#666] hover:border-[#3d37f1] hover:text-[#3d37f1] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              
              {/* Numeros de pagina */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => irParaPagina(pageNum)}
                      disabled={loading}
                      className={`w-10 h-10 rounded-full font-['DM_Sans'] text-[14px] font-medium transition ${
                        page === pageNum 
                          ? 'bg-[#3d37f1] text-white' 
                          : 'text-[#666] hover:bg-[#f2f4ff]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => irParaPagina(page + 1)}
                disabled={page === totalPages || loading}
                className="p-2 rounded-full border border-gray-200 text-[#666] hover:border-[#3d37f1] hover:text-[#3d37f1] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          <p className="text-center mt-4 font-['DM_Sans'] text-[12px] sm:text-[14px] text-[#666]">
            Mostrando {eventos.length} de {total} eventos - Pagina {page} de {totalPages}
          </p>

          {/* Botao carregar mais (alternativa mobile) */}
          {hasMore && (
            <div className="text-center mt-6 sm:hidden">
              <button 
                onClick={carregarMais}
                disabled={loading}
                className="px-6 py-3 border-2 border-[#3d37f1] text-[#3d37f1] rounded-full font-['DM_Sans'] text-[14px] font-bold hover:bg-[#3d37f1] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Carregando...' : 'Carregar mais'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3d37f1" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <p className="font-['DM_Sans'] text-[16px] sm:text-[18px] text-[#6a6a6a] mb-4 sm:mb-6">
            {categoria || formato || busca 
              ? 'Nenhum evento encontrado com os filtros aplicados'
              : 'Nenhum evento disponivel no momento'}
          </p>
          <Link
            href="/organizador"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#3d37f1] text-white rounded-full font-['DM_Sans'] text-[14px] sm:text-[16px] font-bold hover:bg-[#2d27e1] transition"
          >
            Criar primeiro evento
          </Link>
        </div>
      )}
    </div>
  );
}
