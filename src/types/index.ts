// Tipos para la Polla Mundial 2026

export interface Equipo {
  nombre: string;
  bandera: string;
  codigo: string;
}

export interface Resultado {
  equipo1: number | null;
  equipo2: number | null;
}

export interface Partido {
  id: number;
  fase: 'Grupos' | 'Octavos' | 'Cuartos' | 'Semis' | 'Final' | 'Tercer';
  grupo?: string;
  equipo1: Equipo;
  equipo2: Equipo;
  fecha: string;
  hora: string;
  estadio: string;
  ciudad: string;
  estado: 'pendiente' | 'jugado';
  resultadoReal: Resultado;
}

export interface Pronostico {
  id: number;
  apostadorId: number;
  partidoId: number;
  pronostico: Resultado;
  primerGoleador?: string;
  totalGoles?: 'over' | 'under' | null;
  puntosGanados: number;
  estado: 'pendiente' | 'acertado' | 'fallado';
}

export interface Apostador {
  id: number;
  nombre: string;
  avatar: string;
  email?: string;
  paisFavorito?: string;
  puntosTotales: number;
  partidosAcertados: number;
  tendenciasCorrectas: number;
  rachaActual: number;
  mejorRacha: number;
  peorRacha: number;
  pronosticos: Pronostico[];
  esAdmin?: boolean;
}

export type Vista = 'login' | 'dashboard' | 'partidos' | 'apostadores' | 'perfil';

export interface FiltrosPartidos {
  fase: string;
  grupo: string;
  estado: string;
  fecha: string;
}

export interface EstadisticasTorneo {
  totalPartidos: number;
  partidosJugados: number;
  totalApostadores: number;
  liderActual?: Apostador;
  proximoPartido?: Partido;
}
