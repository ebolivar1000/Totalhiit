import React from 'react';
import {
  Activity,
  ArrowRight,
  CalendarHeart,
  MessageCircle,
  Scale,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { buildWhatsappUrl } from '../data/contact';

interface AppTotalHiitSectionProps {
  onOpenPricing: () => void;
}

export const AppTotalHiitSection: React.FC<AppTotalHiitSectionProps> = ({ onOpenPricing }) => {
  const whatsappPremiumUrl = buildWhatsappUrl(
    '¡Hola! Me interesa la versión Premium de la App TotalHiiT. ¿Me podrían brindar más información?'
  );

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

            {/* Acceso Plan Total+40 */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                onClick={onOpenPricing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Acceder con el Plan Total+40</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Y muchas más funciones dentro de la app
              </span>
            </div>

            {/* Descarga Gratuita y WhatsApp Premium */}
            <div className="pt-6 border-t border-stone-200/80">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Descárgala en la versión gratuita
                </span>
              </div>

              {/* Botones de Descarga iOS y Android */}
              <div className="flex flex-wrap gap-3 mb-4">
                {/* Botón iOS / iPhone */}
                <a
                  href="https://totalhiit-app.caribialabs.workers.dev/instalar?plataforma=ios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  title="Instalar App TotalHiiT en iPhone / iPad con Safari"
                >
                  <svg
                    className="w-6 h-6 fill-current text-white shrink-0 group-hover:scale-105 transition-transform"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.62-.75 1.04-1.8 0.92-2.87-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.76 1.01.08 2.04-.49 2.66-1.24z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[10px] text-stone-400 font-medium uppercase tracking-wide">
                      Descargar para
                    </span>
                    <span className="block text-xs font-bold text-white">
                      Apple / iOS
                    </span>
                  </div>
                </a>

                {/* Botón Android */}
                <a
                  href="https://totalhiit-app.caribialabs.workers.dev/descargar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  title="Descargar App TotalHiiT para Android"
                >
                  <svg
                    className="w-6 h-6 fill-current text-[#3DDC84] shrink-0 group-hover:scale-105 transition-transform"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4111 13.8533 8.1 12 8.1s-3.5902.3111-5.1367.8497L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[10px] text-stone-400 font-medium uppercase tracking-wide">
                      Descargar para
                    </span>
                    <span className="block text-xs font-bold text-white">
                      Android
                    </span>
                  </div>
                </a>
              </div>

              {/* Mensaje versión Premium por WhatsApp */}
              <div className="inline-flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200/80 px-3.5 py-2 rounded-xl">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Para la versión Premium,{' '}
                  <a
                    href={whatsappPremiumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:text-emerald-800 underline decoration-emerald-500/50 underline-offset-2"
                  >
                    escríbeme por WhatsApp
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: True Vertical Video (sin bandas negras) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] rounded-[2.5rem] p-3 bg-gradient-to-b from-stone-800 to-stone-950 border border-stone-700/60 shadow-2xl shadow-stone-900/30">
              {/* Speaker / Notch simulator */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-stone-900 rounded-full z-10 border border-white/5 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-950 mr-2 border border-white/10" />
                <div className="w-8 h-1 bg-stone-800 rounded-full" />
              </div>

              {/* Screen Container with exact vertical aspect ratio */}
              <div className="relative rounded-[2rem] overflow-hidden bg-stone-950 border border-stone-800/80 shadow-inner">
                <video
                  src="/images/Video_App_TH_vertical.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label="Demostración en video vertical de la App TotalHiiT"
                  className="w-full h-auto block object-cover"
                />

                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold whitespace-nowrap shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  App TotalHiiT en vivo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
