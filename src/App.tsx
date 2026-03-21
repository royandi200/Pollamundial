import { useState, useEffect } from 'react';
import type { Vista, Apostador, Partido, Pronostico, Resultado } from '@/types';
import { partidosIniciales, apostadoresIniciales } from '@/data/mundial2026';
import { Login } from '@/components/Login';
import { Header } from '@/components/Header';
import { PromoBanner } from '@/components/PromoBanner';
import { Dashboard } from '@/components/Dashboard';
import { Partidos } from '@/components/Partidos';
import { Apostadores } from '@/components/Apostadores';
import { Perfil } from '@/components/Perfil';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

function App() {
  const [vistaActual, setVistaActual] = useState<Vista>('login');
  const [usuarioActual, setUsuarioActual] = useState<Apostador | null>(null);
  const [apostadores, setApostadores] = useState<Apostador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de LocalStorage al iniciar
  useEffect(() => {
    const storedApostadores = localStorage.getItem('polla_apostadores');
    const storedPartidos = localStorage.getItem('polla_partidos');
    const storedPronosticos = localStorage.getItem('polla_pronosticos');
    const storedUsuario = localStorage.getItem('polla_usuario_actual');

    if (storedApostadores) {
      setApostadores(JSON.parse(storedApostadores));
    } else {
      setApostadores(apostadoresIniciales);
      localStorage.setItem('polla_apostadores', JSON.stringify(apostadoresIniciales));
    }

    if (storedPartidos) {
      setPartidos(JSON.parse(storedPartidos));
    } else {
      setPartidos(partidosIniciales);
      localStorage.setItem('polla_partidos', JSON.stringify(partidosIniciales));
    }

    if (storedPronosticos) {
      setPronosticos(JSON.parse(storedPronosticos));
    }

    if (storedUsuario) {
      const user = JSON.parse(storedUsuario);
      setUsuarioActual(user);
      setVistaActual('dashboard');
    }

    setIsLoading(false);
  }, []);

  // Funciones de autenticación
  const handleLogin = (apostadorId: number) => {
    const apostador = apostadores.find(a => a.id === apostadorId);
    if (apostador) {
      setUsuarioActual(apostador);
      localStorage.setItem('polla_usuario_actual', JSON.stringify(apostador));
      setVistaActual('dashboard');
      toast.success(`¡Bienvenido, ${apostador.nombre}!`);
    }
  };

  const handleLoginAdmin = (password: string): boolean => {
    if (password === 'sonda2026') {
      const admin = apostadores.find(a => a.esAdmin);
      if (admin) {
        setUsuarioActual(admin);
        localStorage.setItem('polla_usuario_actual', JSON.stringify(admin));
        setVistaActual('dashboard');
        toast.success('¡Bienvenido, Administrador!');
        return true;
      }
    }
    toast.error('Contraseña incorrecta');
    return false;
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    localStorage.removeItem('polla_usuario_actual');
    setVistaActual('login');
    toast.info('Sesión cerrada');
  };

  const handleRegistrar = (nombre: string, avatar: string, paisFavorito?: string, email?: string): Apostador => {
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
    toast.success('¡Registro exitoso!');
    return nuevoApostador;
  };

  // Funciones de apostadores
  const handleActualizarApostador = (apostadorActualizado: Apostador) => {
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

  const handleEliminarApostador = (apostadorId: number) => {
    const nuevosApostadores = apostadores.filter(a => a.id !== apostadorId);
    setApostadores(nuevosApostadores);
    localStorage.setItem('polla_apostadores', JSON.stringify(nuevosApostadores));

    // Eliminar pronósticos del apostador
    const nuevosPronosticos = pronosticos.filter(p => p.apostadorId !== apostadorId);
    setPronosticos(nuevosPronosticos);
    localStorage.setItem('polla_pronosticos', JSON.stringify(nuevosPronosticos));

    toast.success('Apostador eliminado');
  };

  // Funciones de partidos
  const handleGuardarResultado = (partidoId: number, resultado: Resultado) => {
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

    // Calcular puntos para todos los apostadores
    calcularPuntosParaTodos(partidoId, resultado);
    toast.success('Resultado guardado y puntos calculados');
  };

  // Funciones de pronósticos
  const handleGuardarPronostico = (
    apostadorId: number,
    partidoId: number,
    resultado: Resultado,
    primerGoleador?: string,
    totalGoles?: 'over' | 'under' | null
  ) => {
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
      toast.success('Pronóstico actualizado');
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
      toast.success('Pronóstico guardado');
    }
  };

  // Calcular puntos
  const calcularPuntos = (pronostico: Resultado, resultadoReal: Resultado): { puntos: number; tipo: 'exacto' | 'tendencia' | 'empate' | 'ninguno' } => {
    if (resultadoReal.equipo1 === null || resultadoReal.equipo2 === null) {
      return { puntos: 0, tipo: 'ninguno' };
    }

    const p1 = pronostico.equipo1 ?? 0;
    const p2 = pronostico.equipo2 ?? 0;
    const r1 = resultadoReal.equipo1 ?? 0;
    const r2 = resultadoReal.equipo2 ?? 0;

    // Resultado exacto
    if (p1 === r1 && p2 === r2) {
      return { puntos: 3, tipo: 'exacto' };
    }

    // Empate acertado
    if (p1 === p2 && r1 === r2) {
      return { puntos: 2, tipo: 'empate' };
    }

    // Tendencia correcta (ganador)
    const pronosticoGanador = p1 > p2 ? 1 : p1 < p2 ? 2 : 0;
    const realGanador = r1 > r2 ? 1 : r1 < r2 ? 2 : 0;

    if (pronosticoGanador === realGanador && pronosticoGanador !== 0) {
      return { puntos: 1, tipo: 'tendencia' };
    }

    return { puntos: 0, tipo: 'ninguno' };
  };

  const calcularPuntosParaTodos = (partidoId: number, resultadoReal: Resultado) => {
    const pronosticosDelPartido = pronosticos.filter(p => p.partidoId === partidoId);

    pronosticosDelPartido.forEach(pronostico => {
      const { puntos } = calcularPuntos(pronostico.pronostico, resultadoReal);

      const pronosticoActualizado: Pronostico = {
        ...pronostico,
        puntosGanados: puntos,
        estado: puntos > 0 ? 'acertado' : 'fallado',
      };

      // Actualizar pronóstico
      const nuevosPronosticos = pronosticos.map(p =>
        p.id === pronostico.id ? pronosticoActualizado : p
      );
      setPronosticos(nuevosPronosticos);
      localStorage.setItem('polla_pronosticos', JSON.stringify(nuevosPronosticos));

      // Actualizar apostador
      const apostador = apostadores.find(a => a.id === pronostico.apostadorId);
      if (apostador) {
        const pronosticosApostador = nuevosPronosticos.filter(p => p.apostadorId === apostador.id);
        const nuevosPuntos = pronosticosApostador.reduce((sum, p) => sum + p.puntosGanados, 0);
        const nuevosAcertados = pronosticosApostador.filter(p => p.puntosGanados === 3).length;
        const nuevasTendencias = pronosticosApostador.filter(p => p.puntosGanados === 1).length;
        const nuevosEmpates = pronosticosApostador.filter(p => p.puntosGanados === 2).length;

        // Calcular racha
        let rachaActual = 0;
        let mejorRacha = apostador.mejorRacha;
        const pronosticosOrdenados = [...pronosticosApostador].sort((a, b) => b.id - a.id);

        for (const p of pronosticosOrdenados) {
          if (p.estado === 'acertado') {
            rachaActual++;
          } else if (p.estado === 'fallado') {
            break;
          }
        }

        if (rachaActual > mejorRacha) {
          mejorRacha = rachaActual;
        }

        const apostadorActualizado: Apostador = {
          ...apostador,
          puntosTotales: nuevosPuntos,
          partidosAcertados: nuevosAcertados,
          tendenciasCorrectas: nuevasTendencias + nuevosEmpates,
          rachaActual,
          mejorRacha,
          pronosticos: pronosticosApostador,
        };

        const nuevosApostadores = apostadores.map(a =>
          a.id === apostador.id ? apostadorActualizado : a
        );
        setApostadores(nuevosApostadores);
        localStorage.setItem('polla_apostadores', JSON.stringify(nuevosApostadores));

        if (usuarioActual?.id === apostador.id) {
          setUsuarioActual(apostadorActualizado);
          localStorage.setItem('polla_usuario_actual', JSON.stringify(apostadorActualizado));
        }
      }
    });
  };

  // Renderizar vista actual
  const renderVista = () => {
    if (!usuarioActual) return null;

    switch (vistaActual) {
      case 'dashboard':
        return (
          <Dashboard
            apostadores={apostadores}
            partidos={partidos}
            usuarioActual={usuarioActual}
            onCambiarVista={(vista) => setVistaActual(vista)}
          />
        );
      case 'partidos':
        return (
          <Partidos
            partidos={partidos}
            apostadores={apostadores}
            usuarioActual={usuarioActual}
            pronosticos={pronosticos}
            onGuardarPronostico={handleGuardarPronostico}
            onGuardarResultado={handleGuardarResultado}
            onActualizarApostador={handleActualizarApostador}
            calcularPuntos={calcularPuntos}
          />
        );
      case 'apostadores':
        return (
          <Apostadores
            apostadores={apostadores}
            partidos={partidos}
            pronosticos={pronosticos}
            usuarioActual={usuarioActual}
            onEliminarApostador={handleEliminarApostador}
          />
        );
      case 'perfil':
        return (
          <Perfil
            usuarioActual={usuarioActual}
            apostadores={apostadores}
            partidos={partidos}
            pronosticos={pronosticos}
            onActualizarApostador={handleActualizarApostador}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center sonda-gradient">
        <div className="text-center text-white">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagen-KdoI3pxL9NDcumBpHL3k7nErcSX02G.png"
            alt="SONDA - make it easy"
            style={{ height: '60px', width: 'auto', margin: '0 auto 1rem', filter: 'brightness(0) invert(1)' }}
          />
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  if (vistaActual === 'login' || !usuarioActual) {
    return (
      <>
        <Login
          apostadores={apostadores}
          onLogin={handleLogin}
          onLoginAdmin={handleLoginAdmin}
          onRegistrar={handleRegistrar}
        />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5F5' }}>
      <Header
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
        usuarioActual={usuarioActual}
        onLogout={handleLogout}
      />
      <PromoBanner />
      <main className="flex-1">
        {renderVista()}
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
