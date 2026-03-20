import { useState, useEffect } from 'react';
import type { Partido, Resultado } from '@/types';
import { partidosIniciales, configPuntuacion } from '@/data/mundial2026';

export function usePartidos() {
  const [partidos, setPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    const storedPartidos = localStorage.getItem('polla_partidos');
    if (storedPartidos) {
      setPartidos(JSON.parse(storedPartidos));
    } else {
      setPartidos(partidosIniciales);
      localStorage.setItem('polla_partidos', JSON.stringify(partidosIniciales));
    }
  }, []);

  const guardarResultado = (partidoId: number, resultado: Resultado) => {
    const nuevosPartidos = partidos.map(p => {
      if (p.id === partidoId) {
        return {
          ...p,
          estado: 'jugado' as const,
          resultadoReal: resultado,
        };
      }
      return p;
    });
    setPartidos(nuevosPartidos);
    localStorage.setItem('polla_partidos', JSON.stringify(nuevosPartidos));
  };

  const getPartidoById = (id: number): Partido | undefined => {
    return partidos.find(p => p.id === id);
  };

  const getPartidosByFase = (fase: string): Partido[] => {
    if (fase === 'todos') return partidos;
    return partidos.filter(p => p.fase === fase);
  };

  const getPartidosByGrupo = (grupo: string): Partido[] => {
    if (grupo === 'todos') return partidos;
    return partidos.filter(p => p.grupo === grupo);
  };

  const getPartidosByEstado = (estado: string): Partido[] => {
    if (estado === 'todos') return partidos;
    return partidos.filter(p => p.estado === estado);
  };

  const getProximoPartido = (): Partido | undefined => {
    return partidos.find(p => p.estado === 'pendiente');
  };

  const getPartidosJugados = (): Partido[] => {
    return partidos.filter(p => p.estado === 'jugado');
  };

  const getPartidosPendientes = (): Partido[] => {
    return partidos.filter(p => p.estado === 'pendiente');
  };

  const calcularPuntosPronostico = (
    pronostico: Resultado,
    resultadoReal: Resultado
  ): { puntos: number; tipo: 'exacto' | 'tendencia' | 'empate' | 'ninguno' } => {
    if (resultadoReal.equipo1 === null || resultadoReal.equipo2 === null) {
      return { puntos: 0, tipo: 'ninguno' };
    }

    const p1 = pronostico.equipo1 ?? 0;
    const p2 = pronostico.equipo2 ?? 0;
    const r1 = resultadoReal.equipo1 ?? 0;
    const r2 = resultadoReal.equipo2 ?? 0;

    // Resultado exacto
    if (p1 === r1 && p2 === r2) {
      return { puntos: configPuntuacion.resultadoExacto, tipo: 'exacto' };
    }

    // Empate acertado
    if (p1 === p2 && r1 === r2) {
      return { puntos: configPuntuacion.empateAcertado, tipo: 'empate' };
    }

    // Tendencia correcta (ganador)
    const pronosticoGanador = p1 > p2 ? 1 : p1 < p2 ? 2 : 0;
    const realGanador = r1 > r2 ? 1 : r1 < r2 ? 2 : 0;
    
    if (pronosticoGanador === realGanador && pronosticoGanador !== 0) {
      return { puntos: configPuntuacion.tendenciaCorrecta, tipo: 'tendencia' };
    }

    return { puntos: 0, tipo: 'ninguno' };
  };

  return {
    partidos,
    setPartidos,
    guardarResultado,
    getPartidoById,
    getPartidosByFase,
    getPartidosByGrupo,
    getPartidosByEstado,
    getProximoPartido,
    getPartidosJugados,
    getPartidosPendientes,
    calcularPuntosPronostico,
  };
}
