import { useState, useMemo } from 'react';
import type { Partido, Apostador, Pronostico, Resultado } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy,
  CheckCircle2,
  XCircle,
  Clock4,
  Filter,
  Edit3,
  Eye,
  Shield
} from 'lucide-react';

interface PartidosProps {
  partidos: Partido[];
  apostadores: Apostador[];
  usuarioActual: Apostador;
  pronosticos: Pronostico[];
  onGuardarPronostico: (
    apostadorId: number,
    partidoId: number,
    resultado: Resultado,
    primerGoleador?: string,
    totalGoles?: 'over' | 'under' | null
  ) => void;
  onGuardarResultado: (partidoId: number, resultado: Resultado) => void;
  onActualizarApostador: (apostador: Apostador) => void;
  calcularPuntos: (pronostico: Resultado, resultadoReal: Resultado) => { puntos: number; tipo: string };
}

const FASES = ['todos', 'Grupos', 'Octavos', 'Cuartos', 'Semis', 'Tercer', 'Final'];
const GRUPOS = ['todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Truncar nombre si es muy largo
const truncarNombre = (nombre: string, maxLength: number = 10) => {
  if (nombre.length <= maxLength) return nombre;
  return nombre.substring(0, maxLength) + '...';
};

export function Partidos({ 
  partidos, 
  apostadores, 
  usuarioActual, 
  pronosticos,
  onGuardarPronostico,
  onGuardarResultado,
  onActualizarApostador,
  calcularPuntos
}: PartidosProps) {
  const [faseFiltro, setFaseFiltro] = useState('todos');
  const [grupoFiltro, setGrupoFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  const [modalPronostico, setModalPronostico] = useState(false);
  const [modalResultado, setModalResultado] = useState(false);
  const [modalVerPronosticos, setModalVerPronosticos] = useState(false);

  // Filtros
  const partidosFiltrados = useMemo(() => {
    return partidos.filter(p => {
      if (faseFiltro !== 'todos' && p.fase !== faseFiltro) return false;
      if (grupoFiltro !== 'todos' && p.grupo !== grupoFiltro) return false;
      if (estadoFiltro !== 'todos' && p.estado !== estadoFiltro) return false;
      return true;
    });
  }, [partidos, faseFiltro, grupoFiltro, estadoFiltro]);

  const getPronosticoUsuario = (partidoId: number): Pronostico | undefined => {
    return pronosticos.find(p => p.partidoId === partidoId && p.apostadorId === usuarioActual.id);
  };

  const getEstadoBadge = (estado: string, isMobile = false) => {
    switch (estado) {
      case 'jugado':
        return <Badge className="bg-green-500 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" /> {isMobile ? '' : 'Jugado'}</Badge>;
      case 'pendiente':
        return <Badge variant="secondary" className="text-xs"><Clock4 className="w-3 h-3 mr-1" /> {isMobile ? '' : 'Pendiente'}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[#0033A0]">Partidos del Mundial</h1>
          <p className="text-sm md:text-base text-gray-600">Predice los resultados y gana puntos</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 md:w-5 md:h-5 text-[#0033A0]" />
          <span className="text-xs md:text-sm text-gray-600">
            {partidosFiltrados.length} de {partidos.length}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <Card className="sonda-card">
        <CardContent className="p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <Label className="text-xs md:text-sm mb-1 md:mb-2 block">Fase</Label>
              <Select value={faseFiltro} onValueChange={setFaseFiltro}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todas las fases" />
                </SelectTrigger>
                <SelectContent>
                  {FASES.map(fase => (
                    <SelectItem key={fase} value={fase} className="text-sm">
                      {fase === 'todos' ? 'Todas las fases' : fase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs md:text-sm mb-1 md:mb-2 block">Grupo</Label>
              <Select value={grupoFiltro} onValueChange={setGrupoFiltro}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  {GRUPOS.map(grupo => (
                    <SelectItem key={grupo} value={grupo} className="text-sm">
                      {grupo === 'todos' ? 'Todos los grupos' : `Grupo ${grupo}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs md:text-sm mb-1 md:mb-2 block">Estado</Label>
              <Tabs value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <TabsList className="grid w-full grid-cols-3 h-9 md:h-10">
                  <TabsTrigger value="todos" className="text-xs md:text-sm">Todos</TabsTrigger>
                  <TabsTrigger value="pendiente" className="text-xs md:text-sm">Pend.</TabsTrigger>
                  <TabsTrigger value="jugado" className="text-xs md:text-sm">Jugados</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Partidos */}
      <div className="grid gap-3 md:gap-4">
        {partidosFiltrados.map((partido) => {
          const pronosticoUsuario = getPronosticoUsuario(partido.id);
          const tienePronostico = !!pronosticoUsuario;

          return (
            <Card key={partido.id} className="sonda-card hover:shadow-lg transition-shadow">
              <CardContent className="p-3 md:p-4">
                {/* Layout móvil */}
                <div className="md:hidden">
                  {/* Header con info del partido */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="font-medium">{partido.fase}</span>
                      {partido.grupo && <span>- Grupo {partido.grupo}</span>}
                    </div>
                    {getEstadoBadge(partido.estado, true)}
                  </div>

                  {/* Equipos y marcador */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Equipo 1 */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-2xl shrink-0">{partido.equipo1.bandera}</span>
                      <span className="font-medium text-sm truncate">{truncarNombre(partido.equipo1.nombre, 8)}</span>
                    </div>

                    {/* Marcador */}
                    <div className="flex items-center gap-1 shrink-0">
                      {partido.estado === 'jugado' && partido.resultadoReal.equipo1 !== null ? (
                        <>
                          <span className="bg-[#0033A0] text-white px-2 py-0.5 rounded text-sm font-bold">
                            {partido.resultadoReal.equipo1}
                          </span>
                          <span className="text-gray-400">-</span>
                          <span className="bg-[#0033A0] text-white px-2 py-0.5 rounded text-sm font-bold">
                            {partido.resultadoReal.equipo2}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-gray-400">VS</span>
                      )}
                    </div>

                    {/* Equipo 2 */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="font-medium text-sm truncate text-right">{truncarNombre(partido.equipo2.nombre, 8)}</span>
                      <span className="text-2xl shrink-0">{partido.equipo2.bandera}</span>
                    </div>
                  </div>

                  {/* Fecha y botones */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(partido.fecha).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                      <Clock className="w-3 h-3 ml-1" />
                      {partido.hora}
                    </div>
                    <div className="flex gap-1">
                      {partido.estado === 'pendiente' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setPartidoSeleccionado(partido);
                            setModalPronostico(true);
                          }}
                          className={`h-7 px-2 text-xs ${tienePronostico ? 'bg-amber-500 hover:bg-amber-600' : 'sonda-btn-primary'}`}
                        >
                          {tienePronostico ? <Edit3 className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                        </Button>
                      )}
                      {usuarioActual.esAdmin && partido.estado === 'pendiente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPartidoSeleccionado(partido);
                            setModalResultado(true);
                          }}
                          className="h-7 px-2 text-xs border-green-500 text-green-600"
                        >
                          <Shield className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPartidoSeleccionado(partido);
                          setModalVerPronosticos(true);
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Mi pronóstico */}
                  {tienePronostico && (
                    <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-600">Mi pronóstico:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {pronosticoUsuario.pronostico.equipo1} - {pronosticoUsuario.pronostico.equipo2}
                        </Badge>
                        {pronosticoUsuario.estado !== 'pendiente' && (
                          <Badge className={`text-xs ${pronosticoUsuario.estado === 'acertado' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {pronosticoUsuario.estado === 'acertado' ? `+${pronosticoUsuario.puntosGanados}` : '0'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Layout desktop */}
                <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Info del partido */}
                  <div className="flex items-center gap-4 flex-1 w-full">
                    {/* Equipo 1 */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <span className="text-4xl mb-1">{partido.equipo1.bandera}</span>
                      <span className="font-semibold text-center text-sm truncate w-full">{partido.equipo1.nombre}</span>
                    </div>

                    {/* Marcador / VS */}
                    <div className="flex flex-col items-center px-4 shrink-0">
                      {partido.estado === 'jugado' && partido.resultadoReal.equipo1 !== null ? (
                        <div className="flex items-center gap-2 text-2xl font-bold">
                          <span className="bg-[#0033A0] text-white px-3 py-1 rounded">
                            {partido.resultadoReal.equipo1}
                          </span>
                          <span className="text-gray-400">-</span>
                          <span className="bg-[#0033A0] text-white px-3 py-1 rounded">
                            {partido.resultadoReal.equipo2}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-400">VS</span>
                      )}
                      {getEstadoBadge(partido.estado)}
                    </div>

                    {/* Equipo 2 */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <span className="text-4xl mb-1">{partido.equipo2.bandera}</span>
                      <span className="font-semibold text-center text-sm truncate w-full">{partido.equipo2.nombre}</span>
                    </div>
                  </div>

                  {/* Detalles y acciones */}
                  <div className="flex flex-col items-end gap-2 min-w-[180px]">
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        <Calendar className="w-4 h-4" />
                        {new Date(partido.fecha).toLocaleDateString('es-ES', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="w-4 h-4" />
                        {partido.hora}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <MapPin className="w-4 h-4" />
                        {partido.ciudad}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {partido.estado === 'pendiente' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setPartidoSeleccionado(partido);
                            setModalPronostico(true);
                          }}
                          className={tienePronostico ? 'bg-amber-500 hover:bg-amber-600' : 'sonda-btn-primary'}
                        >
                          {tienePronostico ? (
                            <><Edit3 className="w-4 h-4 mr-1" /> Editar</>
                          ) : (
                            <><Trophy className="w-4 h-4 mr-1" /> Pronosticar</>
                          )}
                        </Button>
                      )}

                      {usuarioActual.esAdmin && partido.estado === 'pendiente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPartidoSeleccionado(partido);
                            setModalResultado(true);
                          }}
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Resultado
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPartidoSeleccionado(partido);
                          setModalVerPronosticos(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mi pronóstico - desktop */}
                {tienePronostico && (
                  <div className="hidden md:flex mt-4 pt-4 border-t items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Mi pronóstico:</span>
                      <Badge variant="outline" className="font-mono text-lg">
                        {pronosticoUsuario.pronostico.equipo1} - {pronosticoUsuario.pronostico.equipo2}
                      </Badge>
                    </div>
                    {pronosticoUsuario.estado !== 'pendiente' && (
                      <Badge className={pronosticoUsuario.estado === 'acertado' ? 'bg-green-500' : 'bg-red-500'}>
                        {pronosticoUsuario.estado === 'acertado' ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> +{pronosticoUsuario.puntosGanados} pts</>
                        ) : (
                          <><XCircle className="w-3 h-3 mr-1" /> Fallado</>
                        )}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Pronóstico */}
      <ModalPronostico
        partido={partidoSeleccionado}
        pronosticoExistente={partidoSeleccionado ? getPronosticoUsuario(partidoSeleccionado.id) : undefined}
        open={modalPronostico}
        onClose={() => {
          setModalPronostico(false);
          setPartidoSeleccionado(null);
        }}
        onGuardar={onGuardarPronostico}
        usuarioActual={usuarioActual}
      />

      {/* Modal de Resultado (Admin) */}
      <ModalResultado
        partido={partidoSeleccionado}
        open={modalResultado}
        onClose={() => {
          setModalResultado(false);
          setPartidoSeleccionado(null);
        }}
        onGuardar={(partidoId, resultado) => {
          onGuardarResultado(partidoId, resultado);
          
          // Calcular puntos para todos los apostadores
          apostadores.forEach(apostador => {
            const pronostico = pronosticos.find(p => p.partidoId === partidoId && p.apostadorId === apostador.id);
            if (pronostico) {
              const { puntos } = calcularPuntos(pronostico.pronostico, resultado);
              const pronosticoActualizado = {
                ...pronostico,
                puntosGanados: puntos,
                estado: puntos > 0 ? 'acertado' as const : 'fallado' as const,
              };
              // tipo se puede usar en el futuro para mostrar el tipo de acierto
              
              const nuevosPronosticos = apostador.pronosticos.map(p => 
                p.id === pronostico.id ? pronosticoActualizado : p
              );
              
              const nuevosPuntos = nuevosPronosticos.reduce((sum, p) => sum + p.puntosGanados, 0);
              const nuevosAcertados = nuevosPronosticos.filter(p => p.estado === 'acertado').length;
              const nuevasTendencias = nuevosPronosticos.filter(p => p.puntosGanados === 1).length;
              
              onActualizarApostador({
                ...apostador,
                pronosticos: nuevosPronosticos,
                puntosTotales: nuevosPuntos,
                partidosAcertados: nuevosAcertados,
                tendenciasCorrectas: nuevasTendencias,
                rachaActual: puntos > 0 ? apostador.rachaActual + 1 : 0,
                mejorRacha: puntos > 0 ? Math.max(apostador.mejorRacha, apostador.rachaActual + 1) : apostador.mejorRacha,
              });
            }
          });
        }}
      />

      {/* Modal Ver Pronósticos */}
      <ModalVerPronosticos
        partido={partidoSeleccionado}
        apostadores={apostadores}
        pronosticos={pronosticos}
        open={modalVerPronosticos}
        onClose={() => {
          setModalVerPronosticos(false);
          setPartidoSeleccionado(null);
        }}
      />
    </div>
  );
}

// Modal de Pronóstico
interface ModalPronosticoProps {
  partido: Partido | null;
  pronosticoExistente?: Pronostico;
  open: boolean;
  onClose: () => void;
  onGuardar: (
    apostadorId: number,
    partidoId: number,
    resultado: Resultado,
    primerGoleador?: string,
    totalGoles?: 'over' | 'under' | null
  ) => void;
  usuarioActual: Apostador;
}

function ModalPronostico({ partido, pronosticoExistente, open, onClose, onGuardar, usuarioActual }: ModalPronosticoProps) {
  const [goles1, setGoles1] = useState(pronosticoExistente?.pronostico.equipo1?.toString() || '');
  const [goles2, setGoles2] = useState(pronosticoExistente?.pronostico.equipo2?.toString() || '');
  const [primerGoleador, setPrimerGoleador] = useState(pronosticoExistente?.primerGoleador || '');
  const [totalGoles, setTotalGoles] = useState<'over' | 'under' | null>(pronosticoExistente?.totalGoles || null);

  if (!partido) return null;

  const handleGuardar = () => {
    const g1 = parseInt(goles1) || 0;
    const g2 = parseInt(goles2) || 0;
    onGuardar(
      usuarioActual.id,
      partido.id,
      { equipo1: g1, equipo2: g2 },
      primerGoleador || undefined,
      totalGoles
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader className="bg-[#0033A0] -mx-4 md:-mx-6 -mt-4 md:-mt-6 p-4 md:p-6 rounded-t-lg">
          <DialogTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <Trophy className="w-5 h-5" />
            Mi Pronóstico
          </DialogTitle>
          <DialogDescription className="text-white/80 text-sm">
            {partido.equipo1.nombre} vs {partido.equipo2.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6 pt-4">
          {/* Marcador */}
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="text-center flex-1 min-w-0">
              <span className="text-3xl md:text-5xl">{partido.equipo1.bandera}</span>
              <p className="font-semibold mt-1 md:mt-2 text-xs md:text-sm truncate">{partido.equipo1.nombre}</p>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Input
                type="number"
                min="0"
                value={goles1}
                onChange={(e) => setGoles1(e.target.value)}
                className="w-12 md:w-16 text-center text-xl md:text-2xl font-bold p-1 md:p-2"
              />
              <span className="text-xl md:text-2xl font-bold text-gray-400">-</span>
              <Input
                type="number"
                min="0"
                value={goles2}
                onChange={(e) => setGoles2(e.target.value)}
                className="w-12 md:w-16 text-center text-xl md:text-2xl font-bold p-1 md:p-2"
              />
            </div>

            <div className="text-center flex-1 min-w-0">
              <span className="text-3xl md:text-5xl">{partido.equipo2.bandera}</span>
              <p className="font-semibold mt-1 md:mt-2 text-xs md:text-sm truncate">{partido.equipo2.nombre}</p>
            </div>
          </div>

          {/* Pronósticos adicionales */}
          <div className="space-y-3 md:space-y-4 border-t pt-3 md:pt-4">
            <div>
              <Label className="text-xs md:text-sm">¿Quién anota el primer gol? (opcional)</Label>
              <Input
                placeholder="Nombre del jugador"
                value={primerGoleador}
                onChange={(e) => setPrimerGoleador(e.target.value)}
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-xs md:text-sm">Total de goles (opcional)</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={totalGoles === 'over' ? 'default' : 'outline'}
                  onClick={() => setTotalGoles('over')}
                  className={`flex-1 text-xs md:text-sm ${totalGoles === 'over' ? 'bg-[#0033A0]' : ''}`}
                >
                  Más de 2.5
                </Button>
                <Button
                  type="button"
                  variant={totalGoles === 'under' ? 'default' : 'outline'}
                  onClick={() => setTotalGoles('under')}
                  className={`flex-1 text-xs md:text-sm ${totalGoles === 'under' ? 'bg-[#0033A0]' : ''}`}
                >
                  Menos de 2.5
                </Button>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 text-sm">
              Cancelar
            </Button>
            <Button onClick={handleGuardar} className="flex-1 sonda-btn-primary text-sm">
              <Trophy className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal de Resultado (Admin)
interface ModalResultadoProps {
  partido: Partido | null;
  open: boolean;
  onClose: () => void;
  onGuardar: (partidoId: number, resultado: Resultado) => void;
}

function ModalResultado({ partido, open, onClose, onGuardar }: ModalResultadoProps) {
  const [goles1, setGoles1] = useState('');
  const [goles2, setGoles2] = useState('');

  if (!partido) return null;

  const handleGuardar = () => {
    const g1 = parseInt(goles1);
    const g2 = parseInt(goles2);
    if (isNaN(g1) || isNaN(g2)) return;
    onGuardar(partido.id, { equipo1: g1, equipo2: g2 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader className="bg-green-600 -mx-4 md:-mx-6 -mt-4 md:-mt-6 p-4 md:p-6 rounded-t-lg">
          <DialogTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <Shield className="w-5 h-5" />
            Ingresar Resultado Real
          </DialogTitle>
          <DialogDescription className="text-white/80 text-sm">
            Solo para administradores
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6 pt-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="text-center flex-1 min-w-0">
              <span className="text-3xl md:text-5xl">{partido.equipo1.bandera}</span>
              <p className="font-semibold mt-1 md:mt-2 text-xs md:text-sm truncate">{partido.equipo1.nombre}</p>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Input
                type="number"
                min="0"
                value={goles1}
                onChange={(e) => setGoles1(e.target.value)}
                className="w-12 md:w-16 text-center text-xl md:text-2xl font-bold p-1 md:p-2"
                placeholder="0"
              />
              <span className="text-xl md:text-2xl font-bold text-gray-400">-</span>
              <Input
                type="number"
                min="0"
                value={goles2}
                onChange={(e) => setGoles2(e.target.value)}
                className="w-12 md:w-16 text-center text-xl md:text-2xl font-bold p-1 md:p-2"
                placeholder="0"
              />
            </div>

            <div className="text-center flex-1 min-w-0">
              <span className="text-3xl md:text-5xl">{partido.equipo2.bandera}</span>
              <p className="font-semibold mt-1 md:mt-2 text-xs md:text-sm truncate">{partido.equipo2.nombre}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 text-sm">
              Cancelar
            </Button>
            <Button onClick={handleGuardar} className="flex-1 bg-green-600 hover:bg-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal Ver Pronósticos
interface ModalVerPronosticosProps {
  partido: Partido | null;
  apostadores: Apostador[];
  pronosticos: Pronostico[];
  open: boolean;
  onClose: () => void;
}

function ModalVerPronosticos({ partido, apostadores, pronosticos, open, onClose }: ModalVerPronosticosProps) {
  if (!partido) return null;

  const pronosticosPartido = pronosticos.filter(p => p.partidoId === partido.id);
  const pronosticosConNombre = pronosticosPartido.map(p => ({
    ...p,
    apostador: apostadores.find(a => a.id === p.apostadorId),
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <Eye className="w-5 h-5" />
            Pronósticos del Partido
          </DialogTitle>
          <DialogDescription className="text-sm">
            {partido.equipo1.nombre} {partido.resultadoReal.equipo1 !== null ? partido.resultadoReal.equipo1 : ''} 
            {' '}-{' '}
            {partido.resultadoReal.equipo2 !== null ? partido.resultadoReal.equipo2 : ''} {partido.equipo2.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {pronosticosConNombre.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Aún no hay pronósticos para este partido</p>
          ) : (
            pronosticosConNombre.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg md:text-xl shrink-0">{p.apostador?.avatar}</span>
                  <span className="font-medium text-sm truncate">{p.apostador?.nombre}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
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
      </DialogContent>
    </Dialog>
  );
}
