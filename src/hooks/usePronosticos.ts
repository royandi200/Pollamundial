import { useState, useEffect } from 'react';
import type { Pronostico, Resultado } from '@/types';

export function usePronosticos() {
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);

  useEffect(() => {
    const storedPronosticos = localStorage.getItem('polla_pronosticos');
    if (storedPronosticos) {
      setPronosticos(JSON.parse(storedPronosticos));
    }
  }, []);

  const guardarPronostico = (
    apostadorId: number,
    partidoId: number,
    resultado: Resultado,
    primerGoleador?: string,
    totalGoles?: 'over' | 'under' | null
  ): Pronostico => {
    const existente = pronosticos.find(
      p => p.apostadorId === apostadorId && p.partidoId === partidoId
    );

    if (existente) {
      const actualizado = {
        ...existente,
        pronostico: resultado,
        primerGoleador,
        totalGoles,
      };
      const nuevosPronosticos = pronosticos.map(p =>
        p.id === existente.id ? actualizado : p
      );
      setPronosticos(nuevosPronosticos);
      localStorage.setItem('polla_pronosticos', JSON.stringify(nuevosPronosticos));
      return actualizado;
    } else {
      const nuevo: Pronostico = {
        id: Date.now(),
        apostadorId,
        partidoId,
        pronostico: resultado,
        primerGoleador,
        totalGoles,
        puntosGanados: 0,
        estado: 'pendiente',
      };
      const nuevosPronosticos = [...pronosticos, nuevo];
      setPronosticos(nuevosPronosticos);
      localStorage.setItem('polla_pronosticos', JSON.stringify(nuevosPronosticos));
      return nuevo;
    }
  };

  const getPronosticoByPartidoYApostador = (
    partidoId: number,
    apostadorId: number
  ): Pronostico | undefined => {
    return pronosticos.find(
      p => p.partidoId === partidoId && p.apostadorId === apostadorId
    );
  };

  const getPronosticosByApostador = (apostadorId: number): Pronostico[] => {
    return pronosticos.filter(p => p.apostadorId === apostadorId);
  };

  const getPronosticosByPartido = (partidoId: number): Pronostico[] => {
    return pronosticos.filter(p => p.partidoId === partidoId);
  };

  const actualizarPronostico = (pronosticoActualizado: Pronostico) => {
    const nuevosPronosticos = pronosticos.map(p =>
      p.id === pronosticoActualizado.id ? pronosticoActualizado : p
    );
    setPronosticos(nuevosPronosticos);
    localStorage.setItem('polla_pronosticos', JSON.stringify(nuevosPronosticos));
  };

  const eliminarPronosticosDeApostador = (apostadorId: number) => {
    const nuevosPronosticos = pronosticos.filter(p => p.apostadorId !== apostadorId);
    setPronosticos(nuevosPronosticos);
    localStorage.setItem('polla_pronosticos', JSON.stringify(nuevosPronosticos));
  };

  return {
    pronosticos,
    setPronosticos,
    guardarPronostico,
    getPronosticoByPartidoYApostador,
    getPronosticosByApostador,
    getPronosticosByPartido,
    actualizarPronostico,
    eliminarPronosticosDeApostador,
  };
}
