import React from 'react';
import { Play, Sparkles, ShieldCheck } from 'lucide-react';
import { INTRO_VIDEO, VideoItem } from '../data/bootcampData';

interface HeroProps {
  onPlayVideo: (v: VideoItem) => void;
  onOpenPricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlayVideo, onOpenPricing }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-rose-50/60 via-stone-50 to-stone-50">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-rose-200/40 via-amber-100/30 to-purple-200/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Programa Especializado · Mujeres +40
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-6">
              Recupera tu fuerza, energía y metabolismo <span className="italic text-rose-600">después de los 40</span>.
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl leading-relaxed">
              El <strong>Bootcamp TOTAL+40</strong> combina entrenamiento HIIT de bajo impacto articular con nutrición antiinflamatoria, diseñado especialmente para los cambios hormonales y el ritmo de vida de la mujer actual.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenPricing}
                className="px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Comenzar Bootcamp TOTAL+40
              </button>

              <button
                onClick={() => onPlayVideo(INTRO_VIDEO)}
                className="px-6 py-4 rounded-full bg-white hover:bg-stone-100 text-stone-800 font-bold text-base border border-stone-200 shadow-sm flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-rose-600 ml-0.5" />
                </div>
                Ver Video de Introducción
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-200/80 w-full max-w-lg text-left">
              <div>
                <p className="font-extrabold text-2xl text-stone-900">12 Clases</p>
                <p className="text-xs text-stone-500 font-medium">4 semanas progresivas</p>
              </div>
              <div>
                <p className="font-extrabold text-2xl text-stone-900">Bajo Impacto</p>
                <p className="text-xs text-stone-500 font-medium">Cuida tus articulaciones</p>
              </div>
              <div>
                <p className="font-extrabold text-2xl text-stone-900">100% Online</p>
                <p className="text-xs text-stone-500 font-medium">A tu propio ritmo</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Video Card preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-3 bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 shadow-2xl shadow-rose-900/10">
              
              {/* Video Thumbnail with Play Button */}
              <div
                onClick={() => onPlayVideo(INTRO_VIDEO)}
                className="group relative cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 shadow-inner"
              >
                <img
                  src={`https://img.youtube.com/vi/${INTRO_VIDEO.youtubeId}/hqdefault.jpg`}
                  alt="Video de Introducción TotalHIIT +40"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent" />

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-600 px-2 py-0.5 rounded-md inline-block mb-1">
                    Vista Previa Oficial
                  </span>
                  <p className="text-sm font-semibold leading-snug line-clamp-2">
                    {INTRO_VIDEO.title}
                  </p>
                </div>
              </div>

              {/* Floating Pill Cards (like Framer / befitbycata) */}
              <div className="mt-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Método Comprobado</p>
                    <p className="text-[11px] text-stone-500">Cero rebotes, salud hormonal</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
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
