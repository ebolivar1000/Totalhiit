import React, { useState } from 'react';
import { Calendar, Play, Clock, ChevronRight, Flower2, Lock } from 'lucide-react';
import { BOOTCAMP_WEEKS, STRETCHING_VIDEOS, VideoItem } from '../data/bootcampData';

interface BootcampModulesProps {
  onSelectVideo: (v: VideoItem) => void;
  onOpenPricing: () => void;
}

export const BootcampModules: React.FC<BootcampModulesProps> = ({ onSelectVideo, onOpenPricing }) => {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const selectedWeek = BOOTCAMP_WEEKS.find((w) => w.weekNumber === activeWeek) || BOOTCAMP_WEEKS[0];

  return (
    <section id="clases" className="py-20 lg:py-28 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            Plan de Entrenamiento · 4 Semanas
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            12 Clases diseñadas exclusivamente para tu cuerpo
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Sin saltos lesivos ni agotamiento extremo. Cada semana construye fuerza, activa tu metabolismo y cuida tus articulaciones paso a paso.
          </p>
        </div>

        {/* Week Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12">
          {BOOTCAMP_WEEKS.map((w) => {
            const isActive = w.weekNumber === activeWeek;
            return (
              <button
                key={w.weekNumber}
                onClick={() => setActiveWeek(w.weekNumber)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                <span>Semana {w.weekNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-500'}`}>
                  3 clases
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Week Display */}
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200/80 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Módulo de la Semana {selectedWeek.weekNumber}
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1 mb-2">
              {selectedWeek.title}
            </h3>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {selectedWeek.description}
            </p>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedWeek.classes.map((cls, idx) => (
              <div
                key={cls.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                onClick={() => onSelectVideo(cls)}
              >
                {/* Thumbnail from PDF extract */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-stone-950/10 transition-colors" />
                  
                  {/* Lock or Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cls.isLocked ? (
                      <div className="w-12 h-12 rounded-full bg-stone-900/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                        <Lock className="w-5 h-5 text-amber-400 group-hover:text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Top Badge: Lock status */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-1 rounded-full bg-stone-900/85 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm border border-stone-700">
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                      Exclusivo Alumnas
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cls.duration}
                  </div>
                </div>

                {/* Body info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Día {idx * 2 + 1}
                    </span>
                    <h4 className="font-bold text-stone-900 text-base mt-1 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {cls.title}
                    </h4>
                    <p className="text-stone-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVideo(cls);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 group-hover:bg-rose-50 text-stone-700 group-hover:text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500 group-hover:text-rose-600" />
                    Ver Detalles de la Clase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complementary Stretching & Mobility Section (from PDF) */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-50/70 via-stone-50 to-rose-50/50 p-6 sm:p-10 border border-amber-200/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Flower2 className="w-3.5 h-3.5" />
                Módulo Complementario
              </div>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
                Videos Complementarios de Estiramiento & Movilidad
              </h3>
              <p className="text-stone-600 text-sm sm:text-base mt-1">
                Rutinas especiales para liberar tensión en articulaciones, espalda y cuello.
              </p>
            </div>

            <button
              onClick={onOpenPricing}
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-all self-start md:self-auto"
            >
              Inscribirme al Bootcamp Completo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STRETCHING_VIDEOS.map((stv) => (
              <div
                key={stv.id}
                onClick={() => onSelectVideo(stv)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row cursor-pointer"
              >
                <div className="sm:w-1/2 aspect-video relative bg-stone-900 overflow-hidden">
                  <img
                    src={stv.image}
                    alt={stv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10">
                    <div className="w-10 h-10 rounded-full bg-stone-900/80 text-white flex items-center justify-center shadow backdrop-blur-sm">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-semibold">
                    {stv.duration}
                  </div>
                </div>

                <div className="p-5 sm:w-1/2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mb-1">
                      Salud Articular
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-amber-600 transition-colors">
                      {stv.title}
                    </h4>
                    <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
                      {stv.description}
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-amber-600 group-hover:text-amber-700 flex items-center gap-1">
                    <span>Ver clase</span> <ChevronRight className="w-3.5 h-3.5" />
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
