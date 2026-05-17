"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

interface HeaderProps {
  user?: User | null;
  userAvatar?: string | null;
}

export function Header({ user, userAvatar }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const userName = user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarUrl = userAvatar || user?.user_metadata?.avatar_url || null;

  return (
    <header className="w-full absolute top-0 left-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-[225px] py-4 lg:py-[39px]">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-9 sm:w-[47px] sm:h-[54px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/V93Zw7LcAT.png)] bg-cover bg-no-repeat" />
          <span className="font-['DM_Sans'] text-2xl sm:text-[40px] font-extrabold text-white">
            Meet<span className="font-normal">flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/home" className="font-['DM_Sans'] text-[16px] font-medium text-white hover:opacity-80">
            Explorar eventos
          </Link>
          <Link href="/meus-eventos" className="font-['DM_Sans'] text-[16px] font-medium text-white hover:opacity-80">
            Meus ingressos
          </Link>
          <Link href="/notificacoes" className="font-['DM_Sans'] text-[16px] font-medium text-white hover:opacity-80">
            Notificacoes
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/organizador"
            className="px-5 py-2.5 rounded-full border border-white font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 transition"
          >
            Organizar um evento
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
              >
                {avatarUrl ? (
                  <Image 
                    src={avatarUrl}
                    alt={userName}
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div 
                    className="w-[50px] h-[50px] rounded-full bg-[#6c5ce7] flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-lg">
                      {userInitial}
                    </span>
                  </div>
                )}
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    {avatarUrl ? (
                      <Image 
                        src={avatarUrl}
                        alt={userName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center">
                        <span className="text-white font-bold">{userInitial}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-['DM_Sans'] text-[14px] font-medium text-[#333]">{userName}</p>
                      <p className="font-['DM_Sans'] text-[12px] text-[#666]">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/perfil"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="font-['DM_Sans'] text-[14px] text-[#333]">Meu Perfil</span>
                  </Link>
                  
                  <Link 
                    href="/meus-eventos"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="font-['DM_Sans'] text-[14px] text-[#333]">Meus Ingressos</span>
                  </Link>

                  <Link 
                    href="/notificacoes"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <span className="font-['DM_Sans'] text-[14px] text-[#333]">Notificacoes</span>
                  </Link>
                  
                  <hr className="my-2 border-gray-200" />
                  
                  <button 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition w-full"
                    onClick={handleLogout}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span className="font-['DM_Sans'] text-[14px] text-[#e74c3c]">Sair</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login"
              className="w-[50px] h-[50px] rounded-full bg-[#6c5ce7] flex items-center justify-center hover:bg-[#5b4cdb] transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-3">
          {user && avatarUrl ? (
            <Image 
              src={avatarUrl}
              alt={userName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
          ) : user ? (
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center">
              <span className="text-white font-bold">{userInitial}</span>
            </div>
          ) : null}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09065e]/95 backdrop-blur-sm border-t border-white/10">
          <nav className="flex flex-col p-4 space-y-2">
            <Link 
              href="/home" 
              className="font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explorar eventos
            </Link>
            <Link 
              href="/meus-eventos" 
              className="font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Meus ingressos
            </Link>
            <Link 
              href="/notificacoes" 
              className="font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Notificacoes
            </Link>
            <Link 
              href="/organizador"
              className="font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Organizar um evento
            </Link>
            
            <hr className="border-white/20 my-2" />
            
            {user ? (
              <>
                <Link 
                  href="/perfil"
                  className="font-['DM_Sans'] text-[16px] font-medium text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <button 
                  className="font-['DM_Sans'] text-[16px] font-medium text-[#e74c3c] hover:bg-white/10 px-4 py-3 rounded-lg transition text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sair
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="font-['DM_Sans'] text-[16px] font-medium text-white bg-[#f5167e] px-4 py-3 rounded-lg transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
