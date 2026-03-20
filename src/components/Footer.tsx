import { Trophy, MapPin, Calendar } from 'lucide-react';

export function Footer() {
  return (
    <footer className="main-footer mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo y marca */}
          <div className="text-center md:text-left">
            <h2 className="sonda-logo text-white text-3xl mb-1">SONDA</h2>
            <p className="text-white/80 flex items-center justify-center md:justify-start gap-2">
              <Trophy className="w-4 h-4" />
              Polla Mundial 2026
            </p>
          </div>

          {/* Info del Mundial */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>México · Estados Unidos · Canadá</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>11 Junio - 19 Julio 2026</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-white/60 text-sm">
            <p>© 2026 SONDA</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
