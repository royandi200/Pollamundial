import { useState } from 'react';
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
    <header
      style={{
        background: '#ffffff',
        borderBottom: '2px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo SONDA */}
          <div className="flex items-center gap-3">
            <img
              src="/sonda-logo.png"
              alt="SONDA - make it easy"
              style={{ height: '44px', width: 'auto', display: 'block' }}
            />
            <span
              className="hidden sm:flex items-center gap-1"
              style={{ color: '#0033A0', fontSize: '0.75rem', fontWeight: 500 }}
            >
              <Trophy className="w-3 h-3" />
              Polla Mundial 2026
            </span>
          </div>

          {/* Navegacion Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = vistaActual === item.vista;
              return (
                <button
                  key={item.vista}
                  onClick={() => onCambiarVista(item.vista)}
                  style={
                    isActive
                      ? { background: '#0033A0', color: '#ffffff', fontWeight: 600, borderRadius: '0.5rem', padding: '0.5rem 1rem' }
                      : { color: '#0033A0', borderRadius: '0.5rem', padding: '0.5rem 1rem' }
                  }
                  className={`flex items-center gap-2 transition-all duration-200 ${!isActive ? 'hover:bg-blue-50' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Usuario y Logout Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {usuarioActual && (
              <div className="flex items-center gap-2" style={{ color: '#0033A0' }}>
                <span className="text-2xl">{usuarioActual.avatar}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{usuarioActual.nombre}</span>
                  <div className="flex items-center gap-1">
                    {usuarioActual.esAdmin && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-semibold flex items-center gap-1"
                        style={{ background: '#FFD700', color: '#0033A0' }}
                      >
                        <Shield className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                    <span className="text-xs" style={{ color: '#0033A0', opacity: 0.6 }}>
                      {usuarioActual.puntosTotales} pts
                    </span>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              style={{ color: '#0033A0' }}
              className="hover:bg-blue-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Boton Menu Mobile */}
          <button
            style={{ color: '#0033A0' }}
            className="md:hidden p-2"
            onClick={() => setMenuMobileOpen(!menuMobileOpen)}
            aria-label="Abrir menu"
          >
            {menuMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuMobileOpen && (
        <div style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb' }} className="md:hidden">
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
                  style={
                    isActive
                      ? { background: '#0033A0', color: '#ffffff', fontWeight: 600 }
                      : { color: '#0033A0' }
                  }
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}

            {/* Usuario Mobile */}
            {usuarioActual && (
              <div style={{ borderTop: '1px solid #e5e7eb' }} className="pt-3 mt-3">
                <div className="flex items-center gap-3 px-4 py-2" style={{ color: '#0033A0' }}>
                  <span className="text-3xl">{usuarioActual.avatar}</span>
                  <div>
                    <p className="font-medium">{usuarioActual.nombre}</p>
                    <p className="text-sm" style={{ color: '#0033A0', opacity: 0.6 }}>
                      {usuarioActual.puntosTotales} puntos
                    </p>
                    {usuarioActual.esAdmin && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-semibold mt-1 inline-flex items-center gap-1"
                        style={{ background: '#FFD700', color: '#0033A0' }}
                      >
                        <Shield className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  style={{ color: '#0033A0' }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-blue-50 rounded-lg mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
