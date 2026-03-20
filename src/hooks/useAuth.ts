import { useState, useEffect } from 'react';
import type { Apostador } from '@/types';
import { apostadoresIniciales, ADMIN_PASSWORD } from '@/data/mundial2026';

export function useAuth() {
  const [usuarioActual, setUsuarioActual] = useState<Apostador | null>(null);
  const [apostadores, setApostadores] = useState<Apostador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedApostadores = localStorage.getItem('polla_apostadores');
    const storedUsuario = localStorage.getItem('polla_usuario_actual');
    
    if (storedApostadores) {
      setApostadores(JSON.parse(storedApostadores));
    } else {
      setApostadores(apostadoresIniciales);
      localStorage.setItem('polla_apostadores', JSON.stringify(apostadoresIniciales));
    }
    
    if (storedUsuario) {
      setUsuarioActual(JSON.parse(storedUsuario));
    }
    
    setIsLoading(false);
  }, []);

  const login = (apostadorId: number) => {
    const apostador = apostadores.find(a => a.id === apostadorId);
    if (apostador) {
      setUsuarioActual(apostador);
      localStorage.setItem('polla_usuario_actual', JSON.stringify(apostador));
      return true;
    }
    return false;
  };

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const admin = apostadores.find(a => a.esAdmin);
      if (admin) {
        setUsuarioActual(admin);
        localStorage.setItem('polla_usuario_actual', JSON.stringify(admin));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem('polla_usuario_actual');
  };

  const registrarApostador = (nombre: string, avatar: string, paisFavorito?: string, email?: string): Apostador => {
    const nuevoApostador: Apostador = {
      id: Date.now(),
      nombre,
      avatar: avatar || '👤',
      email,
      paisFavorito,
      puntosTotales: 0,
      partidosAcertados: 0,
      tendenciasCorrectas: 0,
      rachaActual: 0,
      mejorRacha: 0,
      peorRacha: 0,
      pronosticos: [],
      esAdmin: false,
    };
    
    const nuevosApostadores = [...apostadores, nuevoApostador];
    setApostadores(nuevosApostadores);
    localStorage.setItem('polla_apostadores', JSON.stringify(nuevosApostadores));
    
    return nuevoApostador;
  };

  const actualizarApostador = (apostadorActualizado: Apostador) => {
    const nuevosApostadores = apostadores.map(a => 
      a.id === apostadorActualizado.id ? apostadorActualizado : a
    );
    setApostadores(nuevosApostadores);
    localStorage.setItem('polla_apostadores', JSON.stringify(nuevosApostadores));
    
    if (usuarioActual?.id === apostadorActualizado.id) {
      setUsuarioActual(apostadorActualizado);
      localStorage.setItem('polla_usuario_actual', JSON.stringify(apostadorActualizado));
    }
  };

  const eliminarApostador = (apostadorId: number) => {
    const nuevosApostadores = apostadores.filter(a => a.id !== apostadorId);
    setApostadores(nuevosApostadores);
    localStorage.setItem('polla_apostadores', JSON.stringify(nuevosApostadores));
  };

  return {
    usuarioActual,
    apostadores,
    isLoading,
    login,
    loginAdmin,
    logout,
    registrarApostador,
    actualizarApostador,
    eliminarApostador,
    setApostadores,
  };
}
