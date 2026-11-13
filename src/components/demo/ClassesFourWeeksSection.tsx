import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Play, Clock, ChevronRight, Lock } from 'lucide-react';
import { BOOTCAMP_WEEKS, VideoItem } from '../../data/bootcampData';

interface ClassesFourWeeksSectionProps {
  onSelectVideo: (v: VideoItem) => void;
  onOpenPricing: () => void;
}

export const ClassesFourWeeksSection: React.FC<ClassesFourWeeksSectionProps> = ({
  onSelectVideo,
  onOpenPricing,
}) => {
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const selectedWeek = BOOTCAMP_WEEKS.find((w) => w.weekNumber === activeWeek) || BOOTCAMP_WEEKS[0];

  const sectionRef = useRef<HTMLElement>(null);
  const [irisRadius, setIrisRadius] = useState<number>(150);

  // Efecto Iris / Círculo cinemático de transición entre Sección 1 y 2 (Estilo La Connector House)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Cuando la sección entra desde abajo de la pantalla
      if (rect.top <= windowHeight && rect.top >= -rect.height) {
        // Progreso de 0 (apenas asoma abajo) a 1 (entra completamente)
        const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight * 0.85), 0), 1);
        // El círculo se expande desde el centro de 15% hasta 150% (pantalla completa)
        const radius = 15 + progress * 135;
        setIrisRadius(radius);
      } else if (rect.top < -rect.height) {
        setIrisRadius(150);
      } else {
        setIrisRadius(15);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clases-4-semanas"
      className="relative py-24 lg:py-32 bg-stone-950/95 text-white border-t border-white/10 overflow-hidden scroll-mt-24 transition-all duration-75 will-change-[clip-path]"
      style={{
        clipPath: `circle(${irisRadius}% at 50% 30%)`,
      }}
    >
      {/* Background Video (entrenamiento.mp4 visible y cinemático) */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none overflow-hidden">
        <video
          src="/videos/entrenamiento.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-95 contrast-105"
        />
        {/* Velo muy sutil para que el video se distinga perfectamente */}
        <div className="absolute inset-0 bg-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-transparent to-stone-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0006C]/25 border border-[#FF6FA5]/40 text-[#FF8FBD] text-xs font-bold uppercase tracking-wider mb-6 shadow-md">
            <Calendar className="w-3.5 h-3.5 text-[#FF6FA5]" />
            Programa de 4 semanas
          </div>
          
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            12 Clases diseñadas exclusivamente para tu cuerpo y tus articulaciones.{' '}
            <span className="text-white/80 font-medium block mt-2 text-base sm:text-lg">
              Cada semana construye fuerza y reactiva tu metabolismo sin sobrecargar tu energía.
            </span>
          </p>
        </div>

        {/* Week Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {BOOTCAMP_WEEKS.map((w) => {
            const isActive = w.weekNumber === activeWeek;
            return (
              <button
                key={w.weekNumber}
                onClick={() => setActiveWeek(w.weekNumber)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#E0006C] text-white shadow-lg shadow-rose-600/30 scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                <span>Semana {w.weekNumber}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                  3 clases
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Week Box */}
        <div className="bg-stone-900/80 border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl mb-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8FBD]">
              Módulo Semana {selectedWeek.weekNumber}
            </span>
            <h3 className="font-archivo text-2xl sm:text-3xl font-black text-white mt-1 mb-2">
              {selectedWeek.title}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {selectedWeek.description}
            </p>
          </div>

          {/* Grid of 3 classes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedWeek.classes.map((cls, idx) => (
              <div
                key={cls.id}
                className="group relative bg-stone-950/60 rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF6FA5]/50 transition-all flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                  <img
                    src={cls.image}
                    alt={cls.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-colors" />

                  {!cls.isLocked ? (
                    <button
                      onClick={() => onSelectVideo(cls)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      title="Ver Clase de Prueba"
                    >
                      <span className="w-12 h-12 rounded-full bg-[#E0006C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </span>
                    </button>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-stone-900/80 border border-white/20 text-white/50 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Duration badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-stone-950/80 text-[10px] font-bold text-white/90 flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-[#FF6FA5]" />
                    {cls.duration}
                  </span>

                  {!cls.isLocked && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      Clase de prueba
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8FBD]">
                      Clase 0{idx + 1}
                    </span>
                    <h4 className="font-archivo text-base font-bold text-white mt-1 mb-2 group-hover:text-[#FF8FBD] transition-colors">
                      {cls.title}
                    </h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                    {!cls.isLocked ? (
                      <button
                        onClick={() => onSelectVideo(cls)}
                        className="text-[#FF8FBD] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ver video</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={onOpenPricing}
                        className="text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>Desbloquear con Plan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
