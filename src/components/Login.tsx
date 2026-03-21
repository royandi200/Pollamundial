import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Apostador } from '@/types';
import { Trophy, UserPlus, Users, Shield } from 'lucide-react';

interface LoginProps {
  apostadores: Apostador[];
  onLogin: (apostadorId: number) => void;
  onLoginAdmin: (password: string) => boolean;
  onRegistrar: (nombre: string, avatar: string, paisFavorito?: string, email?: string) => Apostador;
}

const AVATARES = ['👤', '⚽', '🏆', '🔥', '⭐', '🎯', '🎪', '🦁', '🦅', '🐯', '🐺', '🐻'];

const PAISES = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú', 'Uruguay', 'Venezuela',
  'España', 'Francia', 'Alemania', 'Italia', 'Inglaterra', 'Portugal', 'Países Bajos',
  'Estados Unidos', 'Canadá', 'Ecuador', 'Costa Rica', 'Japón', 'Corea del Sur', 'Australia',
  'Marruecos', 'Senegal', 'Nigeria', 'Egipto', 'Croacia', 'Bélgica', 'Suiza', 'Dinamarca'
];

export function Login({ apostadores, onLogin, onLoginAdmin, onRegistrar }: LoginProps) {

  const [apostadorSeleccionado, setApostadorSeleccionado] = useState<string>('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [paisFavorito, setPaisFavorito] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const apostadoresRegulares = apostadores.filter(a => !a.esAdmin);

  const handleLogin = () => {
    if (!apostadorSeleccionado) {
      setError('Por favor selecciona un apostador');
      return;
    }
    onLogin(parseInt(apostadorSeleccionado));
  };

  const handleRegistro = () => {
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    if (apostadores.some(a => a.nombre.toLowerCase() === nombre.toLowerCase())) {
      setError('Ya existe un apostador con ese nombre');
      return;
    }
    const nuevo = onRegistrar(nombre, avatar, paisFavorito, email);
    onLogin(nuevo.id);
  };

  const handleAdminLogin = () => {
    if (onLoginAdmin(adminPassword)) {
      setShowAdminDialog(false);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sonda-gradient">
      <div className="w-full max-w-md">
        {/* Logo SONDA */}
        <div className="text-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagen-KdoI3pxL9NDcumBpHL3k7nErcSX02G.png"
            alt="SONDA - make it easy"
            style={{ height: '60px', width: 'auto', margin: '0 auto 1rem', filter: 'brightness(0) invert(1)' }}
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">Polla Mundial 2026</span>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-white/80">¡Demuestra tu conocimiento futbolero!</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#0033A0]">Bienvenido</CardTitle>
            <CardDescription>Elige cómo quieres ingresar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="existente" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="existente" className="data-[state=active]:bg-[#0033A0] data-[state=active]:text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Existente
                </TabsTrigger>
                <TabsTrigger value="nuevo" className="data-[state=active]:bg-[#0033A0] data-[state=active]:text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nuevo
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-[#0033A0] data-[state=active]:text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existente" className="space-y-4">
                {apostadoresRegulares.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <Label>Selecciona tu nombre</Label>
                      <select
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-[#0033A0]"
                        value={apostadorSeleccionado}
                        onChange={(e) => {
                          setApostadorSeleccionado(e.target.value);
                          setError('');
                        }}
                      >
                        <option value="">-- Seleccionar --</option>
                        {apostadoresRegulares.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.avatar} {a.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button 
                      onClick={handleLogin} 
                      className="w-full sonda-btn-primary"
                    >
                      Ingresar
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">No hay apostadores registrados</p>
                    <p className="text-sm text-gray-400">Regístrate como nuevo apostador</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nuevo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      setError('');
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>País favorito</Label>
                  <select
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
                </div>

                <div className="space-y-2">
                  <Label>Elige tu avatar</Label>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {AVATARES.map((av) => (
                      <button
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`text-2xl p-2 rounded-lg transition-all ${
                          avatar === av
                            ? 'bg-[#0033A0] text-white scale-110'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button onClick={handleRegistro} className="w-full sonda-btn-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarme
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="text-center py-4">
                  <Shield className="w-16 h-16 mx-auto text-[#0033A0] mb-4" />
                  <p className="text-gray-600 mb-4">Acceso exclusivo para administradores</p>
                  <Button 
                    onClick={() => setShowAdminDialog(true)} 
                    variant="outline"
                    className="border-[#0033A0] text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Acceder como Admin
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagen-KdoI3pxL9NDcumBpHL3k7nErcSX02G.png"
            alt="SONDA"
            style={{ height: '24px', width: 'auto', margin: '0 auto 0.25rem', filter: 'brightness(0) invert(1)', opacity: 0.6 }}
          />
          <p>Mundial 2026 - México · Estados Unidos · Canadá</p>
        </div>
      </div>

      {/* Admin Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0033A0]">
              <Shield className="w-5 h-5" />
              Acceso Administrador
            </DialogTitle>
            <DialogDescription>
              Ingresa la contraseña de administrador
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Contraseña"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setError('');
              }}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAdminDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAdminLogin} className="flex-1 sonda-btn-primary">
                Ingresar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
