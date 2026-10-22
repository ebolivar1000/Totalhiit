import React from 'react';
import { Play, Sparkles, ShieldCheck, Flame } from 'lucide-react';
import { INTRO_VIDEO, VideoItem } from '../data/bootcampData';
import { HERO_COLLAGE } from '../data/heroCollage';
import { useSiteContent } from '../hooks/useSiteContent';

interface HeroProps {
  onPlayVideo: (v: VideoItem) => void;
  onOpenPricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlayVideo, onOpenPricing }) => {
  const { heroImages } = useSiteContent();
  const collage = HERO_COLLAGE.map((item, index) => ({
    ...item,
    src: heroImages[index] || item.src,
  }));

  return (
    <section id="programa" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#B00050] text-white">
      {/* Collage translucido de creatividades como fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 grid-rows-4 sm:grid-rows-2 gap-1.5 p-1.5">
          {collage.map((item, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl bg-[#6E0029]">
              <img
                src={item.src}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover scale-110 blur-[5px] saturate-[0.9] opacity-70"
                style={{ objectPosition: item.position }}
              />
            </div>
          ))}
          {/* Celda de marca para completar la retícula */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E0006C] via-[#A00049] to-[#4A0020] flex items-center justify-center">
            <Flame className="w-9 h-9 sm:w-11 sm:h-11 fill-white text-white/90" />
          </div>
        </div>

        {/* Velos magenta para legibilidad del texto */}
        <div className="absolute inset-0 bg-[#A30049]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#B00050] via-[#B00050]/85 to-[#B00050]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#B00050]/80 via-transparent to-[#8A0038]" />
        {/* Magenta gradient overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-[#E0006C]/40 via-[#B00050]/25 to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Programa Especializado · Mujeres +40
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              Recupera tu fuerza, energía y metabolismo <span className="italic text-[#FFD3E6]">después de los 40</span>.
            </h1>

            <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl leading-relaxed">
              El <strong className="text-white">Bootcamp TOTAL+40</strong> combina entrenamiento HIIT de bajo impacto articular con nutrición antiinflamatoria, diseñado especialmente para los cambios hormonales y el ritmo de vida de la mujer actual.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenPricing}
                className="px-8 py-4 rounded-full bg-white hover:bg-[#FFD3E6] text-[#A30049] font-bold text-base shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/30 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Comenzar Bootcamp TOTAL+40
              </button>

              <button
                onClick={() => onPlayVideo(INTRO_VIDEO)}
                className="px-6 py-4 rounded-full bg-black/25 hover:bg-black/40 text-white font-bold text-base border border-white/30 shadow-sm flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                Ver Video de Introducción
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/25 w-full max-w-lg text-left">
              <div>
                <p className="font-extrabold text-2xl text-white">12 Clases</p>
                <p className="text-xs text-white/70 font-medium">4 semanas progresivas</p>
              </div>
              <div>
                <p className="font-extrabold text-2xl text-white">Bajo Impacto</p>
                <p className="text-xs text-white/70 font-medium">Cuida tus articulaciones</p>
              </div>
              <div>
                <p className="font-extrabold text-2xl text-white">100% Online</p>
                <p className="text-xs text-white/70 font-medium">A tu propio ritmo</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Video Card preview with Magenta Glow */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-3 bg-white/10 border border-white/25 shadow-2xl shadow-black/30 backdrop-blur-md">
              
              {/* Thumbnail with Play Button */}
              <div
                onClick={() => onPlayVideo(INTRO_VIDEO)}
                className="group relative cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 shadow-inner"
              >
                <img
                  src={INTRO_VIDEO.image}
                  alt="Video de Introducción TotalHIIT +40"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-black/20 to-transparent" />

                {/* Big Center Play Icon in Magenta Red */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#E0006C] text-white flex items-center justify-center shadow-lg shadow-[#E0006C]/50 group-hover:scale-110 transition-all">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#E0006C] px-2.5 py-0.5 rounded-md inline-block mb-1 shadow-sm">
                    Clase Abierta de Muestra
                  </span>
                  <p className="text-sm font-semibold leading-snug line-clamp-2">
                    {INTRO_VIDEO.title}
                  </p>
                </div>
              </div>

              {/* Floating Pill Cards */}
              <div className="mt-4 p-4 bg-black/25 rounded-2xl border border-white/20 shadow-sm flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Método Adaptado</p>
                    <p className="text-[11px] text-white/70">Cero rebotes, salud articular</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  ★ 4.9/5
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
