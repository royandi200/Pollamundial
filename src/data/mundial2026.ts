import type { Partido, Apostador } from '@/types';

// Equipos clasificados al Mundial 2026 (con placeholders para equipos por definir)
export const equiposMundial2026 = {
  grupoA: [
    { nombre: 'México', bandera: '🇲🇽', codigo: 'MEX' },
    { nombre: 'Italia', bandera: '🇮🇹', codigo: 'ITA' },
    { nombre: 'Egipto', bandera: '🇪🇬', codigo: 'EGY' },
    { nombre: 'Uzbekistán', bandera: '🇺🇿', codigo: 'UZB' },
  ],
  grupoB: [
    { nombre: 'Canadá', bandera: '🇨🇦', codigo: 'CAN' },
    { nombre: 'Croacia', bandera: '🇭🇷', codigo: 'CRO' },
    { nombre: 'Marruecos', bandera: '🇲🇦', codigo: 'MAR' },
    { nombre: 'Togo', bandera: '🇹🇬', codigo: 'TOG' },
  ],
  grupoC: [
    { nombre: 'Estados Unidos', bandera: '🇺🇸', codigo: 'USA' },
    { nombre: 'Alemania', bandera: '🇩🇪', codigo: 'GER' },
    { nombre: 'Ghana', bandera: '🇬🇭', codigo: 'GHA' },
    { nombre: 'Nueva Zelanda', bandera: '🇳🇿', codigo: 'NZL' },
  ],
  grupoD: [
    { nombre: 'Brasil', bandera: '🇧🇷', codigo: 'BRA' },
    { nombre: 'Portugal', bandera: '🇵🇹', codigo: 'POR' },
    { nombre: 'Camerún', bandera: '🇨🇲', codigo: 'CMR' },
    { nombre: 'Japón', bandera: '🇯🇵', codigo: 'JPN' },
  ],
  grupoE: [
    { nombre: 'Argentina', bandera: '🇦🇷', codigo: 'ARG' },
    { nombre: 'Países Bajos', bandera: '🇳🇱', codigo: 'NED' },
    { nombre: 'Senegal', bandera: '🇸🇳', codigo: 'SEN' },
    { nombre: 'Corea del Sur', bandera: '🇰🇷', codigo: 'KOR' },
  ],
  grupoF: [
    { nombre: 'Uruguay', bandera: '🇺🇾', codigo: 'URU' },
    { nombre: 'Bélgica', bandera: '🇧🇪', codigo: 'BEL' },
    { nombre: 'Túnez', bandera: '🇹🇳', codigo: 'TUN' },
    { nombre: 'Ecuador', bandera: '🇪🇨', codigo: 'ECU' },
  ],
  grupoG: [
    { nombre: 'Colombia', bandera: '🇨🇴', codigo: 'COL' },
    { nombre: 'Inglaterra', bandera: '🇬🇧', codigo: 'ENG' },
    { nombre: 'Argelia', bandera: '🇩🇿', codigo: 'ALG' },
    { nombre: 'Australia', bandera: '🇦🇺', codigo: 'AUS' },
  ],
  grupoH: [
    { nombre: 'España', bandera: '🇪🇸', codigo: 'ESP' },
    { nombre: 'Francia', bandera: '🇫🇷', codigo: 'FRA' },
    { nombre: 'Costa de Marfil', bandera: '🇨🇮', codigo: 'CIV' },
    { nombre: 'Irán', bandera: '🇮🇷', codigo: 'IRN' },
  ],
  grupoI: [
    { nombre: 'Paraguay', bandera: '🇵🇾', codigo: 'PAR' },
    { nombre: 'Suiza', bandera: '🇨🇭', codigo: 'SUI' },
    { nombre: 'Nigeria', bandera: '🇳🇬', codigo: 'NGA' },
    { nombre: 'Arabia Saudita', bandera: '🇸🇦', codigo: 'KSA' },
  ],
  grupoJ: [
    { nombre: 'Chile', bandera: '🇨🇱', codigo: 'CHI' },
    { nombre: 'Dinamarca', bandera: '🇩🇰', codigo: 'DEN' },
    { nombre: 'Mali', bandera: '🇲🇱', codigo: 'MLI' },
    { nombre: 'Qatar', bandera: '🇶🇦', codigo: 'QAT' },
  ],
  grupoK: [
    { nombre: 'Perú', bandera: '🇵🇪', codigo: 'PER' },
    { nombre: 'Polonia', bandera: '🇵🇱', codigo: 'POL' },
    { nombre: 'Sudáfrica', bandera: '🇿🇦', codigo: 'RSA' },
    { nombre: 'China', bandera: '🇨🇳', codigo: 'CHN' },
  ],
  grupoL: [
    { nombre: 'Venezuela', bandera: '🇻🇪', codigo: 'VEN' },
    { nombre: 'Escocia', bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', codigo: 'SCO' },
    { nombre: 'Guinea', bandera: '🇬🇳', codigo: 'GUI' },
    { nombre: 'Ucrania', bandera: '🇺🇦', codigo: 'UKR' },
  ],
};

// Sedes del Mundial 2026
const sedes = {
  mexico: [
    { estadio: 'Estadio Azteca', ciudad: 'Ciudad de México' },
    { estadio: 'Estadio BBVA', ciudad: 'Monterrey' },
    { estadio: 'Estadio Akron', ciudad: 'Guadalajara' },
  ],
  usa: [
    { estadio: 'MetLife Stadium', ciudad: 'New York/New Jersey' },
    { estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
    { estadio: 'AT&T Stadium', ciudad: 'Dallas' },
    { estadio: 'Hard Rock Stadium', ciudad: 'Miami' },
    { estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta' },
    { estadio: 'Levi\'s Stadium', ciudad: 'San Francisco' },
    { estadio: 'Lumen Field', ciudad: 'Seattle' },
    { estadio: 'Gillette Stadium', ciudad: 'Boston' },
  ],
  canada: [
    { estadio: 'BC Place', ciudad: 'Vancouver' },
    { estadio: 'BMO Field', ciudad: 'Toronto' },
  ],
};

// Generar partidos de grupos
function generarPartidosGrupos(): Partido[] {
  const partidos: Partido[] = [];
  const grupos = Object.values(equiposMundial2026);
  const todasSedes = [...sedes.mexico, ...sedes.usa, ...sedes.canada];
  
  let id = 1;
  let fechaBase = new Date('2026-06-11');
  
  grupos.forEach((grupo, indexGrupo) => {
    const letraGrupo = String.fromCharCode(65 + indexGrupo);
    
    // Cada grupo juega 6 partidos (todos contra todos)
    const partidosGrupo = [
      [0, 1], [2, 3], // Fecha 1
      [0, 2], [1, 3], // Fecha 2
      [0, 3], [1, 2], // Fecha 3
    ];
    
    partidosGrupo.forEach((par, index) => {
      const sede = todasSedes[(id - 1) % todasSedes.length];
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() + Math.floor((id - 1) / 4));
      
      partidos.push({
        id,
        fase: 'Grupos',
        grupo: letraGrupo,
        equipo1: grupo[par[0]],
        equipo2: grupo[par[1]],
        fecha: fecha.toISOString().split('T')[0],
        hora: `${14 + (index % 3) * 4}:00`,
        estadio: sede.estadio,
        ciudad: sede.ciudad,
        estado: 'pendiente',
        resultadoReal: { equipo1: null, equipo2: null },
      });
      
      id++;
    });
  });
  
  return partidos;
}

// Partidos de eliminatorias (placeholder)
function generarPartidosEliminatorias(): Partido[] {
  const partidos: Partido[] = [];
  const todasSedes = [...sedes.mexico, ...sedes.usa, ...sedes.canada];
  let id = 73;
  
  // Octavos de final (16 partidos)
  for (let i = 0; i < 16; i++) {
    const sede = todasSedes[i % todasSedes.length];
    partidos.push({
      id: id++,
      fase: 'Octavos',
      equipo1: { nombre: `1° Grupo ${String.fromCharCode(65 + Math.floor(i/2))}`, bandera: '❓', codigo: 'TBD' },
      equipo2: { nombre: `2° Grupo ${String.fromCharCode(65 + Math.floor(i/2))}`, bandera: '❓', codigo: 'TBD' },
      fecha: `2026-07-${6 + Math.floor(i/4)}`,
      hora: `${12 + (i % 3) * 4}:00`,
      estadio: sede.estadio,
      ciudad: sede.ciudad,
      estado: 'pendiente',
      resultadoReal: { equipo1: null, equipo2: null },
    });
  }
  
  // Cuartos de final (8 partidos)
  for (let i = 0; i < 8; i++) {
    const sede = todasSedes[i % todasSedes.length];
    partidos.push({
      id: id++,
      fase: 'Cuartos',
      equipo1: { nombre: `Ganador ${89 + i * 2}`, bandera: '❓', codigo: 'TBD' },
      equipo2: { nombre: `Ganador ${90 + i * 2}`, bandera: '❓', codigo: 'TBD' },
      fecha: `2026-07-${10 + Math.floor(i/2)}`,
      hora: `${14 + (i % 2) * 6}:00`,
      estadio: sede.estadio,
      ciudad: sede.ciudad,
      estado: 'pendiente',
      resultadoReal: { equipo1: null, equipo2: null },
    });
  }
  
  // Semifinales (2 partidos)
  for (let i = 0; i < 2; i++) {
    partidos.push({
      id: id++,
      fase: 'Semis',
      equipo1: { nombre: `Ganador ${97 + i * 2}`, bandera: '❓', codigo: 'TBD' },
      equipo2: { nombre: `Ganador ${98 + i * 2}`, bandera: '❓', codigo: 'TBD' },
      fecha: `2026-07-14`,
      hora: i === 0 ? '15:00' : '19:00',
      estadio: i === 0 ? 'AT&T Stadium' : 'SoFi Stadium',
      ciudad: i === 0 ? 'Dallas' : 'Los Angeles',
      estado: 'pendiente',
      resultadoReal: { equipo1: null, equipo2: null },
    });
  }
  
  // Tercer lugar
  partidos.push({
    id: id++,
    fase: 'Tercer',
    equipo1: { nombre: 'Perdedor SF1', bandera: '❓', codigo: 'TBD' },
    equipo2: { nombre: 'Perdedor SF2', bandera: '❓', codigo: 'TBD' },
    fecha: '2026-07-18',
    hora: '15:00',
    estadio: 'Hard Rock Stadium',
    ciudad: 'Miami',
    estado: 'pendiente',
    resultadoReal: { equipo1: null, equipo2: null },
  });
  
  // Final
  partidos.push({
    id: id++,
    fase: 'Final',
    equipo1: { nombre: 'Ganador SF1', bandera: '❓', codigo: 'TBD' },
    equipo2: { nombre: 'Ganador SF2', bandera: '❓', codigo: 'TBD' },
    fecha: '2026-07-19',
    hora: '16:00',
    estadio: 'MetLife Stadium',
    ciudad: 'New York/New Jersey',
    estado: 'pendiente',
    resultadoReal: { equipo1: null, equipo2: null },
  });
  
  return partidos;
}

// Datos iniciales de partidos
export const partidosIniciales: Partido[] = [
  ...generarPartidosGrupos(),
  ...generarPartidosEliminatorias(),
];

// Apostadores de ejemplo
export const apostadoresIniciales: Apostador[] = [
  {
    id: 1,
    nombre: 'Admin SONDA',
    avatar: '👨‍💼',
    email: 'admin@sonda.com',
    paisFavorito: 'Chile',
    puntosTotales: 0,
    partidosAcertados: 0,
    tendenciasCorrectas: 0,
    rachaActual: 0,
    mejorRacha: 0,
    peorRacha: 0,
    pronosticos: [],
    esAdmin: true,
  },
];

// Configuración del sistema de puntuación
export const configPuntuacion = {
  resultadoExacto: 3,
  tendenciaCorrecta: 1,
  empateAcertado: 2,
  bonusGoleador: 0.5,
};

// Admin password (simple para demo)
export const ADMIN_PASSWORD = 'sonda2026';
