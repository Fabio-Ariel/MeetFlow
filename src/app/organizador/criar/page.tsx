'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TipoIngresso {
  nome: string;
  preco: number;
  quantidade?: number;
}

interface Organizador {
  nome: string;
  email: string;
  telefone?: string;
}

export default function CriarEventoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeSection, setActiveSection] = useState('informacoes');
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  // Form state
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [formato, setFormato] = useState('Presencial');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bannerPath, setBannerPath] = useState('');
  const [tiposIngresso, setTiposIngresso] = useState<TipoIngresso[]>([
    { nome: 'Lote 1', preco: 0, quantidade: 100 }
  ]);
  const [eventoPago, setEventoPago] = useState(false);
  const [valorEvento, setValorEvento] = useState(0);
  const [vagas, setVagas] = useState(100);
  const [organizadores, setOrganizadores] = useState<Organizador[]>([
    { nome: '', email: '', telefone: '' }
  ]);

  const sections = [
    { id: 'informacoes', label: 'Informações', icon: '✓' },
    { id: 'data', label: 'Data e local', icon: '📅' },
    { id: 'ingressos', label: 'Ingressos', icon: '🎫' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
    { id: 'revisao', label: 'Revisão', icon: '👁️' },
  ];

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', 'evento');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setBannerPath(data.path);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    }
    setUploadingBanner(false);
  };

  const addIngresso = () => {
    setTiposIngresso([...tiposIngresso, { nome: `Lote ${tiposIngresso.length + 1}`, preco: 0, quantidade: 100 }]);
  };

  const removeIngresso = (index: number) => {
    if (tiposIngresso.length > 1) {
      setTiposIngresso(tiposIngresso.filter((_, i) => i !== index));
    }
  };

  const updateIngresso = (index: number, field: keyof TipoIngresso, value: string | number) => {
    const updated = [...tiposIngresso];
    updated[index] = { ...updated[index], [field]: value };
    setTiposIngresso(updated);
  };

  const addOrganizador = () => {
    setOrganizadores([...organizadores, { nome: '', email: '', telefone: '' }]);
  };

  const removeOrganizador = (index: number) => {
    if (organizadores.length > 1) {
      setOrganizadores(organizadores.filter((_, i) => i !== index));
    }
  };

  const updateOrganizador = (index: number, field: keyof Organizador, value: string) => {
    const updated = [...organizadores];
    updated[index] = { ...updated[index], [field]: value };
    setOrganizadores(updated);
  };

  const handleSubmit = async (status: 'rascunho' | 'publicado') => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('tipo', categoria || 'Evento');
      formData.append('area', categoria || 'Geral');
      formData.append('formato', formato);
      formData.append('dataInicio', dataInicio);
      formData.append('dataTermino', dataTermino || dataInicio);
      formData.append('horarioInicio', horarioInicio);
      formData.append('horarioFim', horarioFim);
      formData.append('localizacao', localizacao);
      formData.append('endereco', endereco);
      formData.append('status', status);
      formData.append('pago', String(eventoPago));
      formData.append('valor', String(eventoPago ? valorEvento : 0));
      formData.append('vagas', String(vagas));
      if (bannerPath) formData.append('bannerPath', bannerPath);
      formData.append('tiposIngresso', JSON.stringify(tiposIngresso.filter(i => i.nome)));
      formData.append('organizadores', JSON.stringify(organizadores.filter(o => o.nome && o.email)));

      const response = await fetch('/api/eventos/criar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        router.push('/organizador');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div 
        className="w-[280px] min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: 'linear-gradient(rgba(26, 16, 64, 0.95), rgba(26, 16, 64, 0.95)), url(/hero-principal.png)' }}
      >
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#6c5ce7] flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div>
              <p className="font-['DM_Sans'] text-[14px] text-white/70">Bem vindo</p>
              <p className="font-['DM_Sans'] text-[16px] font-bold text-white">organizador</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeSection === section.id
                    ? 'bg-[#6c5ce7] text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-['DM_Sans'] text-[14px] font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Back button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            href="/organizador"
            className="flex items-center gap-2 px-4 py-3 border border-white/30 rounded-full text-white/80 hover:bg-white/10 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span className="font-['DM_Sans'] text-[14px]">Voltar</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f8f9fa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['DM_Sans'] text-[28px] font-bold text-[#1a1040]">
                Criar novo evento
              </h1>
              <p className="font-['DM_Sans'] text-[14px] text-[#666]">
                Preencha as informações abaixo para publicar seu evento
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('rascunho')}
                disabled={saving}
                className="px-6 py-3 border border-gray-300 text-[#666] rounded-lg font-['DM_Sans'] text-[14px] font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Salvar rascunho
              </button>
              <button
                onClick={() => handleSubmit('publicado')}
                disabled={saving || !nome || !descricao || !dataInicio || !localizacao}
                className="px-6 py-3 bg-[#6c5ce7] text-white rounded-lg font-['DM_Sans'] text-[14px] font-medium hover:bg-[#5b4cdb] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Publicar evento'}
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 max-w-4xl">
          {/* Informações Básicas */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-[#1a1040] px-6 py-4">
              <h2 className="font-['DM_Sans'] text-[18px] font-bold text-white">
                Informações básicas
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Nome do evento *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome do evento"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Descrição *
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Fale um pouco sobre o evento"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Educação">Educação</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Negócios">Negócios</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Esportes">Esportes</option>
                </select>
              </div>

              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Formato
                </label>
                <div className="flex gap-3">
                  {['Presencial', 'Online', 'Híbrido'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormato(f)}
                      className={`px-6 py-2 rounded-full font-['DM_Sans'] text-[14px] font-medium transition ${
                        formato === f
                          ? 'bg-[#6c5ce7] text-white'
                          : 'bg-[#f8f9fa] text-[#666] border border-gray-200 hover:border-[#6c5ce7]'
                      }`}
                    >
                      {f === 'Presencial' && '🏢 '}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Banner do evento
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full h-[200px] rounded-xl border-2 border-dashed cursor-pointer transition ${
                    bannerPath ? 'border-[#6c5ce7]' : 'border-gray-300 hover:border-[#6c5ce7]'
                  }`}
                >
                  {bannerPath ? (
                    <img src={bannerPath} alt="Banner" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      {uploadingBanner ? (
                        <div className="w-8 h-8 border-2 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <p className="font-['DM_Sans'] text-[14px] text-[#666] mt-2">
                            Clique para adicionar uma imagem
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
            </div>
          </section>

          {/* Data e horário */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-[#1a1040] px-6 py-4">
              <h2 className="font-['DM_Sans'] text-[18px] font-bold text-white">
                Data e horário
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                    Data de início *
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                    Data de término
                  </label>
                  <input
                    type="date"
                    value={dataTermino}
                    onChange={(e) => setDataTermino(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                    Horário de início
                  </label>
                  <input
                    type="time"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                    Horário de término
                  </label>
                  <input
                    type="time"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Localização */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-[#1a1040] px-6 py-4">
              <h2 className="font-['DM_Sans'] text-[18px] font-bold text-white">
                Localização
              </h2>
            </div>
            <div className="p-6">
              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Local ou link do evento *
                </label>
                <div className="relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input
                    type="text"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Informe o local ou link do evento"
                    className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                  />
                </div>
              </div>
              {formato === 'Presencial' && (
                <div className="mt-4">
                  <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                    Endereço completo
                  </label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro, cidade"
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Tipo de Evento - Pago ou Gratuito */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-[#1a1040] px-6 py-4">
              <h2 className="font-['DM_Sans'] text-[18px] font-bold text-white">
                Tipo de Evento
              </h2>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setEventoPago(false)}
                  className={`flex-1 p-4 rounded-xl border-2 transition ${
                    !eventoPago 
                      ? 'border-[#6c5ce7] bg-[#f5f5ff]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      !eventoPago ? 'border-[#6c5ce7]' : 'border-gray-300'
                    }`}>
                      {!eventoPago && <div className="w-2.5 h-2.5 rounded-full bg-[#6c5ce7]" />}
                    </div>
                    <div className="text-left">
                      <p className="font-['DM_Sans'] text-[16px] font-semibold text-[#333]">Evento Gratuito</p>
                      <p className="font-['DM_Sans'] text-[13px] text-[#666]">Sem cobranca para participantes</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setEventoPago(true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition ${
                    eventoPago 
                      ? 'border-[#6c5ce7] bg-[#f5f5ff]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      eventoPago ? 'border-[#6c5ce7]' : 'border-gray-300'
                    }`}>
                      {eventoPago && <div className="w-2.5 h-2.5 rounded-full bg-[#6c5ce7]" />}
                    </div>
                    <div className="text-left">
                      <p className="font-['DM_Sans'] text-[16px] font-semibold text-[#333]">Evento Pago</p>
                      <p className="font-['DM_Sans'] text-[13px] text-[#666]">Pagamento via Stripe</p>
                    </div>
                  </div>
                </button>
              </div>

              {eventoPago && (
                <div className="bg-[#f8f9fa] rounded-xl p-4 border border-gray-200">
                  <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                    Valor do ingresso (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] font-['DM_Sans'] text-[14px]">R$</span>
                    <input
                      type="number"
                      value={valorEvento}
                      onChange={(e) => setValorEvento(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#999]">
                    Os pagamentos serao processados via Stripe
                  </p>
                </div>
              )}

              <div className="mt-4">
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Numero de vagas
                </label>
                <input
                  type="number"
                  value={vagas}
                  onChange={(e) => setVagas(parseInt(e.target.value) || 0)}
                  placeholder="100"
                  min="1"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Ingressos */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-[#1a1040] px-6 py-4">
              <h2 className="font-['DM_Sans'] text-[18px] font-bold text-white">
                Ingressos
              </h2>
            </div>
            <div className="p-6">
              {tiposIngresso.map((ingresso, index) => (
                <div key={index} className="flex gap-4 mb-4 items-end">
                  <div className="flex-1">
                    <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={ingresso.nome}
                      onChange={(e) => updateIngresso(index, 'nome', e.target.value)}
                      placeholder="Ex: Lote 1"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  <div className="w-[150px]">
                    <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                      Preço
                    </label>
                    <input
                      type="number"
                      value={ingresso.preco}
                      onChange={(e) => updateIngresso(index, 'preco', parseFloat(e.target.value) || 0)}
                      placeholder="R$ 0,00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  <div className="w-[120px]">
                    <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      value={ingresso.quantidade || ''}
                      onChange={(e) => updateIngresso(index, 'quantidade', parseInt(e.target.value) || 0)}
                      placeholder="100"
                      min="0"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  {tiposIngresso.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngresso(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngresso}
                className="flex items-center gap-2 px-4 py-2 text-[#6c5ce7] border border-[#6c5ce7] rounded-full font-['DM_Sans'] text-[14px] font-medium hover:bg-[#f5f5ff] transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Adicionar novo ingresso
              </button>
            </div>
          </section>

          {/* Organizadores */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-[#1a1040] px-6 py-4">
              <h2 className="font-['DM_Sans'] text-[18px] font-bold text-white">
                Organizadores
              </h2>
            </div>
            <div className="p-6">
              {organizadores.map((org, index) => (
                <div key={index} className="flex gap-4 mb-4 items-end">
                  <div className="flex-1">
                    <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={org.nome}
                      onChange={(e) => updateOrganizador(index, 'nome', e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={org.email}
                      onChange={(e) => updateOrganizador(index, 'email', e.target.value)}
                      placeholder="seuemail@gmail.com"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  <div className="w-[180px]">
                    <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={org.telefone || ''}
                      onChange={(e) => updateOrganizador(index, 'telefone', e.target.value)}
                      placeholder="Seu telefone"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] focus:border-transparent"
                    />
                  </div>
                  {organizadores.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOrganizador(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOrganizador}
                className="flex items-center gap-2 px-4 py-2 text-[#6c5ce7] border border-[#6c5ce7] rounded-full font-['DM_Sans'] text-[14px] font-medium hover:bg-[#f5f5ff] transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Adicionar organizador
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
