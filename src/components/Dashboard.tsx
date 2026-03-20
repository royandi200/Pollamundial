import type { Apostador, Partido } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Target, 
  TrendingUp,
  Clock,
  MapPin,
  Flag,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  apostadores: Apostador[];
  partidos: Partido[];
  usuarioActual: Apostador;
  onCambiarVista: (vista: 'partidos' | 'apostadores') => void;
}

export function Dashboard({ apostadores, partidos, usuarioActual, onCambiarVista }: DashboardProps) {
  const totalPartidos = partidos.length;
  const partidosJugados = partidos.filter(p => p.estado === 'jugado').length;
  const partidosPendientes = totalPartidos - partidosJugados;
  const progresoTorneo = totalPartidos > 0 ? (partidosJugados / totalPartidos) * 100 : 0;

  // Ordenar apostadores por puntos
  const apostadoresOrdenados = [...apostadores].sort((a, b) => b.puntosTotales - a.puntosTotales);
  const lider = apostadoresOrdenados[0];
  const posicionUsuario = apostadoresOrdenados.findIndex(a => a.id === usuarioActual.id) + 1;

  // Próximo partido
  const proximoPartido = partidos.find(p => p.estado === 'pendiente');

  // Estadísticas del usuario
  const pronosticosUsuario = usuarioActual.pronosticos;
  const pronosticosAcertados = pronosticosUsuario.filter(p => p.estado === 'acertado').length;
  const porcentajeAcierto = pronosticosUsuario.length > 0 
    ? (pronosticosAcertados / pronosticosUsuario.length) * 100 
    : 0;

  // Truncar nombre si es muy largo
  const truncarNombre = (nombre: string, maxLength: number = 15) => {
    if (nombre.length <= maxLength) return nombre;
    return nombre.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Hero Section */}
      <div className="sonda-gradient rounded-xl md:rounded-2xl p-4 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-center md:text-left w-full">
            <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2 truncate">
              ¡Hola, <span className="hidden md:inline">{usuarioActual.nombre}</span>
              <span className="md:hidden">{truncarNombre(usuarioActual.nombre, 12)}</span>! 
              <span className="ml-1">{usuarioActual.avatar}</span>
            </h1>
            <p className="text-white/80 text-sm md:text-lg">
              Bienvenido a la polla del Mundial 2026
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center">
            <div className="text-center bg-white/20 rounded-lg md:rounded-xl p-2 md:p-4 backdrop-blur-sm flex-1 md:flex-none">
              <p className="text-xl md:text-3xl font-bold">{usuarioActual.puntosTotales}</p>
              <p className="text-xs md:text-sm text-white/80">Tus puntos</p>
            </div>
            <div className="text-center bg-white/20 rounded-lg md:rounded-xl p-2 md:p-4 backdrop-blur-sm flex-1 md:flex-none">
              <p className="text-xl md:text-3xl font-bold">#{posicionUsuario}</p>
              <p className="text-xs md:text-sm text-white/80">Tu posición</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="sonda-card">
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg shrink-0">
                <Users className="w-4 h-4 md:w-6 md:h-6 text-[#0033A0]" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-[#0033A0]">{apostadores.length}</p>
                <p className="text-xs md:text-sm text-gray-600 truncate">Apostadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sonda-card">
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-green-100 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-[#0033A0]">{totalPartidos}</p>
                <p className="text-xs md:text-sm text-gray-600 truncate">Partidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sonda-card">
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-yellow-100 rounded-lg shrink-0">
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-[#0033A0]">{partidosPendientes}</p>
                <p className="text-xs md:text-sm text-gray-600 truncate">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sonda-card">
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-purple-100 rounded-lg shrink-0">
                <Target className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-[#0033A0]">
                  {porcentajeAcierto.toFixed(0)}%
                </p>
                <p className="text-xs md:text-sm text-gray-600 truncate">Tu acierto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso del Torneo */}
      <Card className="sonda-card">
        <CardHeader className="pb-2 px-3 md:px-6">
          <CardTitle className="text-sm md:text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#0033A0]" />
            Progreso del Torneo
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="flex justify-between text-xs md:text-sm mb-2">
            <span className="text-gray-600">{partidosJugados} de {totalPartidos} jugados</span>
            <span className="font-semibold text-[#0033A0]">{progresoTorneo.toFixed(1)}%</span>
          </div>
          <Progress value={progresoTorneo} className="h-2 md:h-3" />
        </CardContent>
      </Card>

      {/* Grid Principal */}
      <div className="grid md:grid-cols-2 gap-3 md:gap-6">
        {/* Líder Actual */}
        {lider && (
          <Card className="sonda-card border-2 border-[#FFD700]">
            <CardHeader className="pb-2 px-3 md:px-6">
              <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                Líder de la Polla
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-3xl md:text-5xl shrink-0">{lider.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-xl font-bold text-[#0033A0] truncate">{lider.nombre}</p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                    <span className="text-lg md:text-2xl font-bold text-[#0033A0]">{lider.puntosTotales} pts</span>
                    <span className="text-xs md:text-sm text-gray-500">
                      {lider.partidosAcertados} aciertos
                    </span>
                  </div>
                </div>
                <div className="text-2xl md:text-4xl shrink-0">🥇</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximo Partido */}
        {proximoPartido && (
          <Card className="sonda-card">
            <CardHeader className="pb-2 px-3 md:px-6">
              <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#0033A0]" />
                Próximo Partido
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 md:gap-3 flex-1 min-w-0">
                  <span className="text-2xl md:text-4xl shrink-0">{proximoPartido.equipo1.bandera}</span>
                  <span className="text-sm md:text-lg font-semibold truncate hidden sm:block">{proximoPartido.equipo1.nombre}</span>
                </div>

                <span className="text-lg md:text-xl font-bold text-gray-400 shrink-0">VS</span>

                <div className="flex items-center gap-1 md:gap-3 flex-1 min-w-0 justify-end">
                  <span className="text-sm md:text-lg font-semibold truncate hidden sm:block text-right">{proximoPartido.equipo2.nombre}</span>
                  <span className="text-2xl md:text-4xl shrink-0">{proximoPartido.equipo2.bandera}</span>
                </div>
              </div>
              <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  {new Date(proximoPartido.fecha).toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  {proximoPartido.hora}
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">{proximoPartido.ciudad}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Acciones Rápidas */}
      <div className="grid md:grid-cols-2 gap-2 md:gap-4">
        <Button 
          onClick={() => onCambiarVista('partidos')}
          className="sonda-btn-primary h-auto py-3 md:py-4 text-sm md:text-base"
        >
          <Flag className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
          <div className="text-left">
            <p className="font-semibold truncate">Hacer mi pronóstico</p>
            <p className="text-xs md:text-sm opacity-80 truncate hidden sm:block">Predice los resultados</p>
          </div>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-auto shrink-0" />
        </Button>

        <Button 
          onClick={() => onCambiarVista('apostadores')}
          variant="outline"
          className="h-auto py-3 md:py-4 border-[#0033A0] text-[#0033A0] hover:bg-[#0033A0] hover:text-white text-sm md:text-base"
        >
          <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
          <div className="text-left">
            <p className="font-semibold truncate">Ver clasificación</p>
            <p className="text-xs md:text-sm opacity-80 truncate hidden sm:block">Tabla de posiciones</p>
          </div>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-auto shrink-0" />
        </Button>
      </div>

      {/* Estadísticas del Usuario */}
      <Card className="sonda-card">
        <CardHeader className="px-3 md:px-6">
          <CardTitle className="text-sm md:text-lg flex items-center gap-2">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-[#0033A0]" />
            Tus Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="text-center p-2 md:p-4 bg-blue-50 rounded-lg">
              <p className="text-xl md:text-3xl font-bold text-[#0033A0]">{usuarioActual.puntosTotales}</p>
              <p className="text-xs md:text-sm text-gray-600">Puntos totales</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-green-50 rounded-lg">
              <p className="text-xl md:text-3xl font-bold text-green-600">{usuarioActual.partidosAcertados}</p>
              <p className="text-xs md:text-sm text-gray-600">Aciertos exactos</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-yellow-50 rounded-lg">
              <p className="text-xl md:text-3xl font-bold text-yellow-600">{usuarioActual.tendenciasCorrectas}</p>
              <p className="text-xs md:text-sm text-gray-600">Tendencias</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-purple-50 rounded-lg">
              <p className="text-xl md:text-3xl font-bold text-purple-600">{usuarioActual.rachaActual}</p>
              <p className="text-xs md:text-sm text-gray-600">Racha actual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
