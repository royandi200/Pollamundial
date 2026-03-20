import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Zap, Star, TrendingUp, Award } from 'lucide-react';

interface PromoMessage {
  id: number;
  text: string;
  subtext?: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
}

const promoMessages: PromoMessage[] = [
  {
    id: 1,
    text: "SONDA - Tecnología que transforma",
    subtext: "Innovación para tu negocio",
    icon: Zap,
    color: "text-white",
    bgGradient: "from-[#0033A0] via-[#1a4fc7] to-[#0033A0]"
  },
  {
    id: 2,
    text: "¡Demuestra tu pasión futbolera!",
    subtext: "Participa en la polla oficial SONDA",
    icon: Sparkles,
    color: "text-white",
    bgGradient: "from-[#FFD700] via-[#FFA500] to-[#FFD700]"
  },
  {
    id: 3,
    text: "Mundial 2026 - México · USA · Canadá",
    subtext: "Del 11 de junio al 19 de julio",
    icon: Star,
    color: "text-white",
    bgGradient: "from-[#006847] via-[#00965e] to-[#006847]"
  },
  {
    id: 4,
    text: "¿Ya hiciste tus pronósticos?",
    subtext: "No te quedes fuera de la competencia",
    icon: TrendingUp,
    color: "text-white",
    bgGradient: "from-[#CE1126] via-[#e83e4a] to-[#CE1126]"
  },
  {
    id: 5,
    text: "SONDA - 45 años de excelencia",
    subtext: "Líder en servicios IT de Latinoamérica",
    icon: Award,
    color: "text-white",
    bgGradient: "from-[#001F66] via-[#0033A0] to-[#001F66]"
  }
];

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + promoMessages.length) % promoMessages.length);
  }, []);

  // Auto-rotación cada 3 segundos
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  if (!isVisible) return null;

  const currentMessage = promoMessages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div 
      className={`relative w-full bg-gradient-to-r ${currentMessage.bgGradient} transition-all duration-500 ease-in-out overflow-hidden`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shimmer" />
      </div>

      {/* Contenido principal */}
      <div className="relative max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Navegación izquierda */}
          <button
            onClick={prevSlide}
            className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            aria-label="Mensaje anterior"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Mensaje central */}
          <div className="flex-1 flex items-center justify-center gap-2 md:gap-3 min-w-0">
            <div className="shrink-0 animate-pulse-slow">
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="text-center min-w-0">
              <p className={`text-xs md:text-sm font-semibold ${currentMessage.color} truncate`}>
                {currentMessage.text}
              </p>
              {currentMessage.subtext && (
                <p className="text-[10px] md:text-xs text-white/80 truncate hidden sm:block">
                  {currentMessage.subtext}
                </p>
              )}
            </div>
          </div>

          {/* Indicadores y navegación derecha */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {/* Indicadores de puntos */}
            <div className="hidden sm:flex items-center gap-1">
              {promoMessages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white w-3' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al mensaje ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              aria-label="Siguiente mensaje"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsVisible(false)}
              className="ml-1 p-1 rounded-full hover:bg-white/20 transition-colors text-white/60 hover:text-white"
              aria-label="Cerrar banner"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div 
          className="h-full bg-white/60 transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentIndex + 1) / promoMessages.length) * 100}%`,
            transition: isPaused ? 'none' : 'width 3s linear'
          }}
        />
      </div>

      {/* Estilos animación */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
