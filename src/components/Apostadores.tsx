import { useState, useMemo } from 'react';
import type { Apostador, Partido, Pronostico } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Trophy, 
  Medal, 
  Target, 
  TrendingUp, 
  Search,
  Trash2,
  Eye,
  Crown,
  Award,
  Star
} from 'lucide-react';

interface ApostadoresProps {
  apostadores: Apostador[];
  partidos: Partido[];
  pronosticos: Pronostico[];
  usuarioActual: Apostador;
  onEliminarApostador: (id: number) => void;
}

export function Apostadores({ 
  apostadores, 
  partidos, 
  pronosticos,
  usuarioActual,
  onEliminarApostador 
}: ApostadoresProps) {
  const [busqueda, setBusqueda] = useState('');
  const [ordenarPor, setOrdenarPor] = useState<'puntos' | 'nombre' | 'racha'>('puntos');
  const [apostadorSeleccionado, setApostadorSeleccionado] = useState<Apostador | null>(null);
  const [modalDetalle, setModalDetalle] = useState(false);

  // Filtrar y ordenar apostadores
  const apostadoresFiltrados = useMemo(() => {
    let filtrados = apostadores.filter(a => 
      a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    switch (ordenarPor) {
      case 'puntos':
        filtrados.sort((a, b) => b.puntosTotales - a.puntosTotales);
        break;
      case 'nombre':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'racha':
        filtrados.sort((a, b) => b.rachaActual - a.rachaActual);
        break;
    }

    return filtrados;
  }, [apostadores, busqueda, ordenarPor]);

  // Podio (top 3)
  const podio = apostadoresFiltrados.slice(0, 3);

  // Truncar nombre si es muy largo
  const truncarNombre = (nombre: string, maxLength: number = 12) => {
    if (nombre.length <= maxLength) return nombre;
    return nombre.substring(0, maxLength) + '...';
  };

  const getPosicionIcon = (posicion: number) => {
    switch (posicion) {
      case 1:
        return <Crown className="w-4 h-4 md:w-6 md:h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 md:w-6 md:h-6 text-amber-600" />;
      default:
        return <span className="text-sm md:text-lg font-bold text-gray-500">#{posicion}</span>;
    }
  };

  const getPosicionClass = (posicion: number) => {
    switch (posicion) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300';
      default:
        return 'hover:bg-gray-50';
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[#0033A0] flex items-center gap-2">
            <Trophy className="w-6 h-6 md:w-8 md:h-8" />
            <span className="truncate">Tabla de Clasificación</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600">Ranking de apostadores</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-gray-600">{apostadores.length} apostadores</span>
        </div>
      </div>

      {/* Podio */}
      {podio.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-8">
          {/* Segundo lugar */}
          <Card className="sonda-card order-2 md:order-1 border-2 border-gray-300">
            <CardContent className="p-2 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-1 md:mb-2">🥈</div>
              <span className="text-3xl md:text-5xl">{podio[1].avatar}</span>
              <h3 className="font-bold text-sm md:text-lg mt-1 md:mt-2 truncate" title={podio[1].nombre}>
                {truncarNombre(podio[1].nombre, 8)}
              </h3>
              <p className="text-lg md:text-2xl font-bold text-[#0033A0]">{podio[1].puntosTotales} <span className="text-xs md:text-sm">pts</span></p>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">{podio[1].partidosAcertados} aciertos</p>
            </CardContent>
          </Card>

          {/* Primer lugar */}
          <Card className="sonda-card order-1 md:order-2 border-2 border-yellow-400 md:transform md:scale-110 z-10">
            <CardContent className="p-2 md:p-6 text-center">
              <div className="text-3xl md:text-5xl mb-1 md:mb-2">🥇</div>
              <span className="text-4xl md:text-6xl">{podio[0].avatar}</span>
              <h3 className="font-bold text-base md:text-xl mt-1 md:mt-2 truncate" title={podio[0].nombre}>
                {truncarNombre(podio[0].nombre, 8)}
              </h3>
              <p className="text-xl md:text-3xl font-bold text-[#0033A0]">{podio[0].puntosTotales} <span className="text-xs md:text-sm">pts</span></p>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">{podio[0].partidosAcertados} aciertos</p>
              <Badge className="mt-1 md:mt-2 bg-yellow-400 text-yellow-900 text-xs">
                <Crown className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                <span className="hidden sm:inline">Líder</span>
              </Badge>
            </CardContent>
          </Card>

          {/* Tercer lugar */}
          <Card className="sonda-card order-3 border-2 border-amber-600">
            <CardContent className="p-2 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-1 md:mb-2">🥉</div>
              <span className="text-3xl md:text-5xl">{podio[2].avatar}</span>
              <h3 className="font-bold text-sm md:text-lg mt-1 md:mt-2 truncate" title={podio[2].nombre}>
                {truncarNombre(podio[2].nombre, 8)}
              </h3>
              <p className="text-lg md:text-2xl font-bold text-[#0033A0]">{podio[2].puntosTotales} <span className="text-xs md:text-sm">pts</span></p>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">{podio[2].partidosAcertados} aciertos</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="sonda-card">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar apostador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 text-sm md:text-base"
              />
            </div>
            <div className="w-full sm:w-40 md:w-48">
              <select
                className="w-full p-2 border rounded-lg text-sm md:text-base"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as 'puntos' | 'nombre' | 'racha')}
              >
                <option value="puntos">Por puntos</option>
                <option value="nombre">Por nombre</option>
                <option value="racha">Por racha</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Clasificación - Versión móvil con cards */}
      <div className="md:hidden space-y-2">
        {apostadoresFiltrados.map((apostador, index) => {
          const posicion = index + 1;
          const esUsuarioActual = apostador.id === usuarioActual.id;

          return (
            <Card 
              key={apostador.id} 
              className={`sonda-card ${getPosicionClass(posicion)} ${esUsuarioActual ? 'ring-2 ring-[#0033A0]' : ''}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="shrink-0">
                    {getPosicionIcon(posicion)}
                  </div>
                  <span className="text-2xl shrink-0">{apostador.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm truncate">{apostador.nombre}</span>
                      {esUsuarioActual && (
                        <Badge className="bg-[#0033A0] text-xs px-1">Tú</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{apostador.partidosAcertados} aciertos</span>
                      <span>•</span>
                      <span>Racha: {apostador.rachaActual}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-[#0033A0]">{apostador.puntosTotales}</p>
                    <p className="text-xs text-gray-500">pts</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setApostadorSeleccionado(apostador);
                        setModalDetalle(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {usuarioActual.esAdmin && !apostador.esAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`¿Eliminar a ${apostador.nombre}?`)) {
                            onEliminarApostador(apostador.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabla de Clasificación - Versión desktop */}
      <Card className="sonda-card overflow-hidden hidden md:block">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Clasificación Completa</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Pos</th>
                  <th className="px-4 py-3 text-left">Apostador</th>
                  <th className="px-4 py-3 text-center">Puntos</th>
                  <th className="px-4 py-3 text-center">Exactos</th>
                  <th className="px-4 py-3 text-center">Tendencias</th>
                  <th className="px-4 py-3 text-center">Racha</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apostadoresFiltrados.map((apostador, index) => {
                  const posicion = index + 1;
                  const esUsuarioActual = apostador.id === usuarioActual.id;

                  return (
                    <tr 
                      key={apostador.id} 
                      className={`border-t transition-colors ${getPosicionClass(posicion)} ${esUsuarioActual ? 'ring-2 ring-[#0033A0] ring-inset' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getPosicionIcon(posicion)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{apostador.avatar}</span>
                          <div>
                            <span className="font-medium">{apostador.nombre}</span>
                            {esUsuarioActual && (
                              <Badge className="ml-2 bg-[#0033A0]">Tú</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xl font-bold text-[#0033A0]">{apostador.puntosTotales}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="bg-green-50">
                          <Target className="w-3 h-3 mr-1" />
                          {apostador.partidosAcertados}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="bg-blue-50">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {apostador.tendenciasCorrectas}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          variant="outline" 
                          className={apostador.rachaActual > 2 ? 'bg-green-50 text-green-700' : ''}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {apostador.rachaActual}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setApostadorSeleccionado(apostador);
                              setModalDetalle(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {usuarioActual.esAdmin && !apostador.esAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => {
                                if (confirm(`¿Eliminar a ${apostador.nombre}?`)) {
                                  onEliminarApostador(apostador.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalle */}
      <ModalDetalleApostador
        apostador={apostadorSeleccionado}
        partidos={partidos}
        pronosticos={pronosticos}
        open={modalDetalle}
        onClose={() => {
          setModalDetalle(false);
          setApostadorSeleccionado(null);
        }}
      />
    </div>
  );
}

// Modal de Detalle del Apostador
interface ModalDetalleApostadorProps {
  apostador: Apostador | null;
  partidos: Partido[];
  pronosticos: Pronostico[];
  open: boolean;
  onClose: () => void;
}

function ModalDetalleApostador({ apostador, partidos, pronosticos, open, onClose }: ModalDetalleApostadorProps) {
  if (!apostador) return null;

  const pronosticosApostador = pronosticos.filter(p => p.apostadorId === apostador.id);
  const pronosticosConPartido = pronosticosApostador.map(p => ({
    ...p,
    partido: partidos.find(pt => pt.id === p.partidoId),
  }));

  const porcentajeAcierto = pronosticosApostador.length > 0
    ? (pronosticosApostador.filter(p => p.estado === 'acertado').length / pronosticosApostador.length) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader className="bg-[#0033A0] -mx-4 md:-mx-6 -mt-4 md:-mt-6 p-4 md:p-6 rounded-t-lg">
          <DialogTitle className="text-white flex items-center gap-3">
            <span className="text-3xl md:text-4xl">{apostador.avatar}</span>
            <div className="min-w-0">
              <p className="text-lg md:text-xl truncate">{apostador.nombre}</p>
              <p className="text-xs md:text-sm text-white/70">{apostador.puntosTotales} puntos totales</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4">
          <div className="text-center p-2 md:p-4 bg-blue-50 rounded-lg">
            <p className="text-xl md:text-2xl font-bold text-[#0033A0]">{apostador.puntosTotales}</p>
            <p className="text-xs md:text-sm text-gray-600">Puntos</p>
          </div>
          <div className="text-center p-2 md:p-4 bg-green-50 rounded-lg">
            <p className="text-xl md:text-2xl font-bold text-green-600">{apostador.partidosAcertados}</p>
            <p className="text-xs md:text-sm text-gray-600">Exactos</p>
          </div>
          <div className="text-center p-2 md:p-4 bg-yellow-50 rounded-lg">
            <p className="text-xl md:text-2xl font-bold text-yellow-600">{porcentajeAcierto.toFixed(0)}%</p>
            <p className="text-xs md:text-sm text-gray-600">Acierto</p>
          </div>
          <div className="text-center p-2 md:p-4 bg-purple-50 rounded-lg">
            <p className="text-xl md:text-2xl font-bold text-purple-600">{apostador.mejorRacha}</p>
            <p className="text-xs md:text-sm text-gray-600">Mejor racha</p>
          </div>
        </div>

        {/* Historial de pronósticos */}
        <div className="mt-4 md:mt-6">
          <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3">Historial de Pronósticos</h3>
          <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
            {pronosticosConPartido.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay pronósticos registrados</p>
            ) : (
              pronosticosConPartido.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.partido?.equipo1.bandera}</span>
                    <span className="text-xs md:text-sm">vs</span>
                    <span className="text-lg">{p.partido?.equipo2.bandera}</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Badge variant="outline" className="font-mono text-xs md:text-sm">
                      {p.pronostico.equipo1} - {p.pronostico.equipo2}
                    </Badge>
                    {p.estado !== 'pendiente' && (
                      <Badge className={p.estado === 'acertado' ? 'bg-green-500' : 'bg-red-500'}>
                        {p.estado === 'acertado' ? '+' : ''}{p.puntosGanados}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
