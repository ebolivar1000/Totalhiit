import React from 'react';
import {
  Activity,
  ArrowRight,
  CalendarHeart,
  Scale,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

interface AppTotalHiitSectionProps {
  onOpenPricing: () => void;
}

export const AppTotalHiitSection: React.FC<AppTotalHiitSectionProps> = ({ onOpenPricing }) => {
  const features = [
    {
      icon: <Scale className="w-5 h-5 text-rose-600" />,
      title: 'Seguimiento de Peso',
      desc: 'Registra tu evolución y visualiza tu progreso semanal de forma simple y motivadora.',
    },
    {
      icon: <Activity className="w-5 h-5 text-amber-600" />,
      title: 'Cálculo de IMC',
      desc: 'Monitorea tu Índice de Masa Corporal y métricas clave para acompañar tu transformación.',
    },
    {
      icon: <CalendarHeart className="w-5 h-5 text-pink-600" />,
      title: 'Ciclo menstrual',
      desc: 'Lleva el control de tu ciclo para adaptar tu entrenamiento, descanso y niveles de energía.',
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-emerald-600" />,
      title: 'Generación personalizada de menús nutricionales',
      desc: 'Crea menús adaptados a tus objetivos y preferencias alimentarias en cuestión de segundos.',
    },
  ];

  return (
    <section id="app-totalhiit" className="py-20 lg:py-28 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Info & Features */}
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Smartphone className="w-3.5 h-3.5" />
              NUEVA App · Incluida en el Plan Total+40
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-5">
              App <span className="text-rose-600">TotalHiiT</span>
            </h2>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-8">
              Con tu inscripción al <strong className="text-stone-900">plan Total+40</strong> obtienes acceso exclusivo a nuestra <strong className="text-stone-900">NUEVA App</strong>, diseñada para acompañarte cada día con herramientas inteligentes de salud y nutrición en un solo lugar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-rose-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/70 flex items-center justify-center mb-3 shadow-xs">
                    {feat.icon}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenPricing}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Acceder con el Plan Total+40</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Y muchas más funciones dentro de la app
              </span>
            </div>
          </div>

          {/* Right Column: Looping Video */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-200 shadow-2xl shadow-stone-900/15 aspect-video">
              <video
                src="/images/Video_App_TH_opt.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Demostración en video de la App TotalHiiT"
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/75 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vista previa · App TotalHiiT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
