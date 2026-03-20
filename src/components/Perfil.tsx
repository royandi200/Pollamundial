import { useState } from 'react';
import type { Apostador, Partido, Pronostico } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Flag, 
  Trophy, 
  Target, 
  TrendingUp, 
  Edit3,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Clock4,
  Award,
  Zap
} from 'lucide-react';

interface PerfilProps {
  usuarioActual: Apostador;
  apostadores: Apostador[];
  partidos: Partido[];
  pronosticos: Pronostico[];
  onActualizarApostador: (apostador: Apostador) => void;
}

const AVATARES = ['👤', '⚽', '🏆', '🔥', '⭐', '🎯', '🎪', '🦁', '🦅', '🐯', '🐺', '🐻', '🐼', '🦊', '🦄'];
const PAISES = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú', 'Uruguay', 'Venezuela',
  'España', 'Francia', 'Alemania', 'Italia', 'Inglaterra', 'Portugal', 'Países Bajos',
  'Estados Unidos', 'Canadá', 'Ecuador', 'Costa Rica', 'Japón', 'Corea del Sur', 'Australia',
  'Marruecos', 'Senegal', 'Nigeria', 'Egipto', 'Croacia', 'Bélgica', 'Suiza', 'Dinamarca'
];

export function Perfil({ 
  usuarioActual, 
  apostadores, 
  partidos, 
  pronosticos,
  onActualizarApostador 
}: PerfilProps) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuarioActual.nombre);
  const [email, setEmail] = useState(usuarioActual.email || '');
  const [paisFavorito, setPaisFavorito] = useState(usuarioActual.paisFavorito || '');
  const [avatar, setAvatar] = useState(usuarioActual.avatar);

  // Posición en la tabla
  const posicion = [...apostadores]
    .sort((a, b) => b.puntosTotales - a.puntosTotales)
    .findIndex(a => a.id === usuarioActual.id) + 1;

  // Pronósticos del usuario
  const pronosticosUsuario = pronosticos.filter(p => p.apostadorId === usuarioActual.id);
  const pronosticosConPartido = pronosticosUsuario.map(p => ({
    ...p,
    partido: partidos.find(pt => pt.id === p.partidoId),
  }));

  // Estadísticas
  const pronosticosAcertados = pronosticosUsuario.filter(p => p.estado === 'acertado').length;
  const pronosticosFallados = pronosticosUsuario.filter(p => p.estado === 'fallado').length;
  const pronosticosPendientes = pronosticosUsuario.filter(p => p.estado === 'pendiente').length;
  const porcentajeAcierto = pronosticosUsuario.length > 0
    ? (pronosticosAcertados / (pronosticosAcertados + pronosticosFallados)) * 100
    : 0;

  const handleGuardar = () => {
    onActualizarApostador({
      ...usuarioActual,
      nombre: nombre || usuarioActual.nombre,
      email: email || undefined,
      paisFavorito: paisFavorito || undefined,
      avatar,
    });
    setEditando(false);
  };

  const handleCancelar = () => {
    setNombre(usuarioActual.nombre);
    setEmail(usuarioActual.email || '');
    setPaisFavorito(usuarioActual.paisFavorito || '');
    setAvatar(usuarioActual.avatar);
    setEditando(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header del Perfil */}
      <div className="sonda-gradient rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <span className="text-8xl">{usuarioActual.avatar}</span>
            {posicion <= 3 && (
              <div className="absolute -top-2 -right-2 text-4xl">
                {posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{usuarioActual.nombre}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Badge className="bg-white/20 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                #{posicion} en la clasificación
              </Badge>
              {usuarioActual.paisFavorito && (
                <Badge className="bg-white/20 text-white">
                  <Flag className="w-3 h-3 mr-1" />
                  {usuarioActual.paisFavorito}
                </Badge>
              )}
              {usuarioActual.esAdmin && (
                <Badge className="bg-yellow-400 text-[#0033A0]">
                  <Award className="w-3 h-3 mr-1" />
                  ADMIN
                </Badge>
              )}
            </div>
          </div>
          <div className="text-center bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-4xl font-bold">{usuarioActual.puntosTotales}</p>
            <p className="text-sm text-white/80">Puntos totales</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="estadisticas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estadisticas" className="data-[state=active]:bg-[#0033A0] data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="pronosticos" className="data-[state=active]:bg-[#0033A0] data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Mis Pronósticos
          </TabsTrigger>
          <TabsTrigger value="perfil" className="data-[state=active]:bg-[#0033A0] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Mi Perfil
          </TabsTrigger>
        </TabsList>

        {/* Estadísticas */}
        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="sonda-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-[#0033A0]">{usuarioActual.puntosTotales}</p>
                <p className="text-sm text-gray-600">Puntos totales</p>
              </CardContent>
            </Card>
            <Card className="sonda-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{usuarioActual.partidosAcertados}</p>
                <p className="text-sm text-gray-600">Aciertos exactos</p>
              </CardContent>
            </Card>
            <Card className="sonda-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{usuarioActual.tendenciasCorrectas}</p>
                <p className="text-sm text-gray-600">Tendencias</p>
              </CardContent>
            </Card>
            <Card className="sonda-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{porcentajeAcierto.toFixed(0)}%</p>
                <p className="text-sm text-gray-600">% de acierto</p>
              </CardContent>
            </Card>
          </div>

          <Card className="sonda-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#0033A0]" />
                Racha de Aciertos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0033A0]">{usuarioActual.rachaActual}</p>
                  <p className="text-sm text-gray-600">Racha actual</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">{usuarioActual.mejorRacha}</p>
                  <p className="text-sm text-gray-600">Mejor racha</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-500">{usuarioActual.peorRacha}</p>
                  <p className="text-sm text-gray-600">Peor racha</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de pronósticos */}
          <Card className="sonda-card">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Pronósticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-green-600">{pronosticosAcertados}</p>
                  <p className="text-sm text-gray-600">Acertados</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                  <p className="text-2xl font-bold text-red-600">{pronosticosFallados}</p>
                  <p className="text-sm text-gray-600">Fallados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Clock4 className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{pronosticosPendientes}</p>
                  <p className="text-sm text-gray-600">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mis Pronósticos */}
        <TabsContent value="pronosticos" className="space-y-4">
          <Card className="sonda-card">
            <CardHeader>
              <CardTitle className="text-lg">Historial de Pronósticos</CardTitle>
            </CardHeader>
            <CardContent>
              {pronosticosConPartido.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Aún no has hecho ningún pronóstico</p>
                  <p className="text-sm text-gray-400">Ve a la sección de Partidos para empezar</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {pronosticosConPartido
                    .sort((a, b) => (b.partido?.id || 0) - (a.partido?.id || 0))
                    .map((p) => (
                    <div 
                      key={p.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        p.estado === 'acertado' ? 'bg-green-50 border-green-200' :
                        p.estado === 'fallado' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">{p.partido?.equipo1.bandera}</span>
                          <span className="text-sm text-gray-500">vs</span>
                          <span className="text-2xl">{p.partido?.equipo2.bandera}</span>
                        </div>
                        <div className="hidden md:block text-sm text-gray-500">
                          {p.partido?.fase} {p.partido?.grupo && `- Grupo ${p.partido.grupo}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-lg">
                          {p.pronostico.equipo1} - {p.pronostico.equipo2}
                        </Badge>
                        {p.partido?.estado === 'jugado' && (
                          <Badge variant="outline" className="font-mono bg-gray-100">
                            {p.partido.resultadoReal.equipo1} - {p.partido.resultadoReal.equipo2}
                          </Badge>
                        )}
                        {p.estado !== 'pendiente' ? (
                          <Badge className={p.estado === 'acertado' ? 'bg-green-500' : 'bg-red-500'}>
                            {p.estado === 'acertado' ? (
                              <><CheckCircle2 className="w-3 h-3 mr-1" /> +{p.puntosGanados}</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> 0</>
                            )}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock4 className="w-3 h-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editar Perfil */}
        <TabsContent value="perfil" className="space-y-4">
          <Card className="sonda-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
              {!editando ? (
                <Button onClick={() => setEditando(true)} variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancelar} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleGuardar} size="sm" className="sonda-btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div>
                <Label className="mb-2 block">Avatar</Label>
                {editando ? (
                  <div className="flex flex-wrap gap-2">
                    {AVATARES.map((av) => (
                      <button
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`text-3xl p-2 rounded-lg transition-all ${
                          avatar === av
                            ? 'bg-[#0033A0] text-white scale-110'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-6xl">{usuarioActual.avatar}</span>
                )}
              </div>

              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                {editando ? (
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{usuarioActual.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                {editando ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                ) : (
                  <p className="text-lg">{usuarioActual.email || <span className="text-gray-400">No especificado</span>}</p>
                )}
              </div>

              {/* País Favorito */}
              <div>
                <Label htmlFor="pais">País Favorito</Label>
                {editando ? (
                  <select
                    id="pais"
                    className="w-full p-2 border rounded-lg"
                    value={paisFavorito}
                    onChange={(e) => setPaisFavorito(e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {PAISES.map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg">{usuarioActual.paisFavorito || <span className="text-gray-400">No especificado</span>}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
