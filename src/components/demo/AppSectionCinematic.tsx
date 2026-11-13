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
import { buildWhatsappUrl } from '../../data/contact';

interface AppSectionCinematicProps {
  onOpenPricing: () => void;
}

export const AppSectionCinematic: React.FC<AppSectionCinematicProps> = ({ onOpenPricing }) => {
  const whatsappPremiumUrl = buildWhatsappUrl(
    '¡Hola! Me interesa la versión Premium de la App TotalHiiT. ¿Me podrían brindar más información?'
  );

  const features = [
    {
      icon: <Scale className="w-5 h-5 text-[#FF6FA5]" />,
      title: 'Seguimiento de Peso',
      desc: 'Registra tu evolución y visualiza tu progreso semanal de forma simple y motivadora.',
    },
    {
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      title: 'Cálculo de IMC',
      desc: 'Monitorea tu Índice de Masa Corporal y métricas clave para acompañar tu transformación.',
    },
    {
      icon: <CalendarHeart className="w-5 h-5 text-pink-400" />,
      title: 'Ciclo menstrual',
      desc: 'Lleva el control de tu ciclo para adaptar tu entrenamiento, descanso y niveles de energía.',
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-emerald-400" />,
      title: 'Menús nutricionales personalizados',
      desc: 'Crea menús adaptados a tus objetivos y preferencias alimentarias en segundos.',
    },
  ];

  return (
    <section id="app-totalhiit" className="py-24 lg:py-32 bg-stone-900 text-white border-y border-white/10 relative overflow-hidden scroll-mt-24">
      {/* Background Studio Lighting Effect */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#E0006C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Info & Downloads */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0006C]/20 border border-[#FF6FA5]/40 text-[#FF8FBD] text-xs font-bold uppercase tracking-wider mb-5">
              <Smartphone className="w-3.5 h-3.5" />
              NUEVA App · Incluida en el Plan Total+40
            </div>

            <h2 className="font-archivo text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-5">
              App <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA5] to-rose-400">TotalHiiT</span>
            </h2>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 font-normal">
              Con tu inscripción al <strong className="text-white font-semibold">plan Total+40</strong> obtienes acceso exclusivo a nuestra <strong className="text-white font-semibold">NUEVA App</strong>, diseñada para acompañarte cada día con herramientas inteligentes de salud y nutrición en un solo lugar.
            </p>

            {/* Feature Cards in Dark Editorial Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF6FA5]/30 transition-all backdrop-blur-sm"
                >
                  <div className="mb-2">{feat.icon}</div>
                  <h3 className="font-archivo font-bold text-sm text-white mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Plan */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onOpenPricing}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E0006C] to-rose-600 hover:from-rose-600 hover:to-[#E0006C] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Acceder con el Plan Total+40</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Y muchas más funciones dentro de la app
              </span>
            </div>

            {/* Downloads & WhatsApp Premium Section */}
            <div className="pt-6 border-t border-white/15">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Descárgala en la versión gratuita
                </span>
              </div>

              {/* Badges iOS & Android (Fondo Blanco de Alto Contraste) */}
              <div className="flex flex-wrap gap-3.5 mb-5">
                {/* Apple / iOS */}
                <a
                  href="https://totalhiit-app.caribialabs.workers.dev/instalar?plataforma=ios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 border border-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:scale-105"
                  title="Instalar App TotalHiiT en iPhone / iPad con Safari"
                >
                  <svg
                    className="w-7 h-7 fill-current text-stone-900 shrink-0 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.62-.75 1.04-1.8 0.92-2.87-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.76 1.01.08 2.04-.49 2.66-1.24z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[11px] text-stone-500 font-bold uppercase tracking-wide">
                      Descargar para
                    </span>
                    <span className="block text-sm font-black text-stone-950 font-archivo">
                      Apple / iOS
                    </span>
                  </div>
                </a>

                {/* Android */}
                <a
                  href="https://totalhiit-app.caribialabs.workers.dev/descargar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 border border-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:scale-105"
                  title="Descargar App TotalHiiT para Android"
                >
                  <svg
                    className="w-7 h-7 fill-current text-[#008744] shrink-0 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4111 13.8533 8.1 12 8.1s-3.5902.3111-5.1367.8497L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[11px] text-stone-500 font-bold uppercase tracking-wide">
                      Descargar para
                    </span>
                    <span className="block text-sm font-black text-stone-950 font-archivo">
                      Android
                    </span>
                  </div>
                </a>
              </div>

              {/* WhatsApp Premium */}
              <div className="inline-flex items-center gap-2 text-xs text-white/80 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Para la versión Premium,{' '}
                  <a
                    href={whatsappPremiumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    escríbeme por WhatsApp
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Vertical Smartphone Mockup (SIN BORDES NEGROS) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[310px] sm:max-w-[340px] rounded-[3rem] p-3.5 bg-gradient-to-b from-stone-800 to-stone-950 border border-stone-700/80 shadow-[0_0_50px_rgba(224,0,108,0.2)]">
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-full z-20 border border-white/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-950 mr-2 border border-white/20" />
                <div className="w-9 h-1 bg-stone-700 rounded-full" />
              </div>

              {/* Screen: overflow-hidden + exact aspect ratio + object-cover elimina cualquier borde negro lateral */}
              <div className="relative aspect-[9/19] rounded-[2.3rem] overflow-hidden bg-black border border-white/10">
                <video
                  src="/images/Video_App_TH_vertical_CORTO.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Video vertical demostrativo de la App TotalHiiT"
                  className="w-full h-full object-cover block"
                />

                {/* Floating pill over video */}
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold whitespace-nowrap shadow-lg">
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
