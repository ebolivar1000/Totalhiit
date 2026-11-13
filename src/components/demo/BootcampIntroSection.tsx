import React from 'react';
import { Play, Sparkles, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { INTRO_VIDEO, VideoItem } from '../../data/bootcampData';

interface BootcampIntroSectionProps {
  onPlayVideo: (v: VideoItem) => void;
  onOpenPricing: () => void;
}

export const BootcampIntroSection: React.FC<BootcampIntroSectionProps> = ({
  onPlayVideo,
  onOpenPricing,
}) => {
  return (
    <section id="bootcamp" className="relative min-h-[90vh] py-24 lg:py-36 bg-stone-950 text-white overflow-hidden flex items-center scroll-mt-24">
      {/* Background Video (intro-totalhiit.mp4 brillante y visible) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          src="/videos/intro-totalhiit.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover filter brightness-95 contrast-105 scale-100"
        />
        {/* Velo muy sutil: deja ver la acción del video claramente */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-950/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0006C]/25 border border-[#FF6FA5]/40 text-[#FF8FBD] text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6FA5]" />
            Bootcamp Especializado · Mujeres +40
          </div>

          <h2 className="font-archivo text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.92] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            BOOTCAMP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA5] via-rose-400 to-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              TOTAL+40
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-white mb-8 leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            El <strong className="text-white font-bold">Bootcamp TOTAL+40</strong> combina entrenamiento HIIT de impacto adaptado con nutrición antiinflamatoria, diseñado especialmente para los cambios metabólicos y el ritmo de vida de la mujer actual.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <button
              onClick={onOpenPricing}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#E0006C] to-rose-600 hover:from-rose-600 hover:to-[#E0006C] text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPlayVideo(INTRO_VIDEO)}
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all hover:border-[#FF6FA5]/50 cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-[#E0006C] flex items-center justify-center">
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </span>
              <span>Ver Video Explicativo (2 min)</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF6FA5] shrink-0" />
              <span className="text-xs text-white/80 font-medium">Bajo impacto articular</span>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs text-white/80 font-medium">Activa tu metabolismo</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-pink-400 shrink-0" />
              <span className="text-xs text-white/80 font-medium">A tu propio ritmo diario</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
