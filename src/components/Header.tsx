import type { Vista, Apostador } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X,
  Trophy,
  Shield
} from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  vistaActual: Vista;
  onCambiarVista: (vista: Vista) => void;
  usuarioActual: Apostador | null;
  onLogout: () => void;
}

const menuItems: { vista: Vista; label: string; icon: React.ElementType }[] = [
  { vista: 'dashboard', label: 'Inicio', icon: Home },
  { vista: 'partidos', label: 'Partidos', icon: Calendar },
  { vista: 'apostadores', label: 'Apostadores', icon: Users },
  { vista: 'perfil', label: 'Mi Perfil', icon: User },
];

export function Header({ vistaActual, onCambiarVista, usuarioActual, onLogout }: HeaderProps) {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  return (
    <header className="main-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagen-KdoI3pxL9NDcumBpHL3k7nErcSX02G.png"
              alt="SONDA - make it easy"
              className="h-10 w-auto"
            />
            <span className="text-xs text-[#0033A0]/70 flex items-center gap-1 font-medium">
              <Trophy className="w-3 h-3" />
              Polla Mundial 2026
            </span>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = vistaActual === item.vista;
              return (
                <button
                  key={item.vista}
                  onClick={() => onCambiarVista(item.vista)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0033A0] text-white font-semibold'
                      : 'text-[#0033A0]/80 hover:bg-[#0033A0]/10 hover:text-[#0033A0]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Usuario y Logout */}
          <div className="hidden md:flex items-center gap-4">
            {usuarioActual && (
              <div className="flex items-center gap-2 text-[#0033A0]">
                <span className="text-2xl">{usuarioActual.avatar}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{usuarioActual.nombre}</span>
                  <div className="flex items-center gap-1">
                    {usuarioActual.esAdmin && (
                      <span className="text-xs bg-yellow-400 text-[#0033A0] px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                    <span className="text-xs text-[#0033A0]/60">{usuarioActual.puntosTotales} pts</span>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-[#0033A0] hover:bg-[#0033A0]/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Botón Menú Mobile */}
          <button
            className="md:hidden text-[#0033A0] p-2"
            onClick={() => setMenuMobileOpen(!menuMobileOpen)}
          >
            {menuMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      {menuMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = vistaActual === item.vista;
              return (
                <button
                  key={item.vista}
                  onClick={() => {
                    onCambiarVista(item.vista);
                    setMenuMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#0033A0] text-white font-semibold'
                      : 'text-[#0033A0] hover:bg-[#0033A0]/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            
            {/* Usuario Mobile */}
            {usuarioActual && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center gap-3 px-4 py-2 text-[#0033A0]">
                  <span className="text-3xl">{usuarioActual.avatar}</span>
                  <div>
                    <p className="font-medium">{usuarioActual.nombre}</p>
                    <p className="text-sm text-[#0033A0]/60">{usuarioActual.puntosTotales} puntos</p>
                    {usuarioActual.esAdmin && (
                      <span className="text-xs bg-yellow-400 text-[#0033A0] px-1.5 py-0.5 rounded font-semibold mt-1 inline-flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[#0033A0] hover:bg-[#0033A0]/10 rounded-lg mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
