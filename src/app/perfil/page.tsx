'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PerfilData {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  bio: string | null;
  avatar: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadPerfil() {
      try {
        const response = await fetch('/api/perfil');
        if (response.status === 401) {
          router.push('/login?redirect=/perfil');
          return;
        }
        const data = await response.json();
        if (data.perfil) {
          setPerfil(data.perfil);
          setNome(data.perfil.nome || '');
          setTelefone(data.perfil.telefone || '');
          setBio(data.perfil.bio || '');
          setAvatarUrl(data.perfil.avatar);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
      setLoading(false);
    }
    loadPerfil();
  }, [router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida' });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB' });
      return;
    }

    setUploadingAvatar(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', 'avatar');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setAvatarUrl(data.path);
        setMessage({ type: 'success', text: 'Foto atualizada!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao fazer upload da imagem' });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setMessage({ type: 'error', text: 'Erro ao fazer upload da imagem' });
    }
    
    setUploadingAvatar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('telefone', telefone);
      formData.append('bio', bio);
      if (avatarUrl) {
        formData.append('avatarPath', avatarUrl);
      }

      const response = await fetch('/api/perfil', {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar perfil' });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3d37f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative w-full h-[300px] bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(135deg, #09065e 0%, #1a1a4e 100%)' }}
      >
        {/* Header simplificado */}
        <header className="w-full h-[112px] absolute top-0 left-0 z-50">
          <div className="flex items-center justify-between px-[225px] py-[39px]">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-[47px] h-[54px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/V93Zw7LcAT.png)] bg-cover bg-no-repeat" />
              <span className="font-['DM_Sans'] text-[40px] font-extrabold text-white">
                Meet<span className="font-normal">flow</span>
              </span>
            </Link>
            <Link 
              href="/home"
              className="px-5 py-2.5 rounded-full border border-white font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 transition"
            >
              Voltar para Home
            </Link>
          </div>
        </header>
        
        <div className="absolute bottom-12 left-[225px]">
          <h1 className="font-['DM_Sans'] text-[40px] font-bold text-white">
            Meu Perfil
          </h1>
          <p className="font-['DM_Sans'] text-[18px] text-white/80">
            Gerencie suas informações pessoais
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto py-12 px-4">
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <p className="font-['DM_Sans'] text-[14px]">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="font-['DM_Sans'] text-[20px] font-bold text-[#242565] mb-6">
              Foto de Perfil
            </h2>
            <div className="flex items-center gap-6">
              <div 
                onClick={handleAvatarClick}
                className="relative w-[120px] h-[120px] rounded-full bg-[#3d37f1] flex items-center justify-center cursor-pointer group overflow-hidden"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {nome.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  {uploadingAvatar ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="px-6 py-3 bg-[#f2f4ff] text-[#3d37f1] rounded-full font-['DM_Sans'] text-[14px] font-medium hover:bg-[#e8ebff] transition disabled:opacity-50"
                >
                  {uploadingAvatar ? 'Enviando...' : 'Alterar foto'}
                </button>
                <p className="font-['DM_Sans'] text-[12px] text-[#666] mt-2">
                  JPG, PNG ou GIF. Máximo 5MB.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="font-['DM_Sans'] text-[20px] font-bold text-[#242565] mb-6">
              Informações Pessoais
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3d37f1] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={perfil?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="font-['DM_Sans'] text-[12px] text-[#666] mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3d37f1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-['DM_Sans'] text-[14px] font-medium text-[#333] mb-2">
                  Biografia
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-['DM_Sans'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3d37f1] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/home"
              className="px-8 py-4 border-2 border-gray-200 text-[#666] rounded-full font-['DM_Sans'] text-[16px] font-bold hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-[#3d37f1] text-white rounded-full font-['DM_Sans'] text-[16px] font-bold hover:bg-[#2d27e1] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
