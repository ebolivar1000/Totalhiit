import React from 'react';
import { Video, Users, HeartHandshake, Apple, MessageCircle, Gift, Radio } from 'lucide-react';
import { buildWhatsappUrl } from '../data/contact';

const LIVE_MESSAGE =
  '¡Hola! Me interesa la modalidad de Clases en Vivo de TOTALHIIT. Quiero evaluar mi caso de forma privada y conocer los paquetes de 8, 12 o 16 clases mensuales por Zoom.';

const TRIAL_MESSAGE =
  '¡Hola! Quiero aprovechar mi clase gratis de prueba de TOTALHIIT. ¿Cómo coordino el día y horario?';

const PACKAGES = [
  { classes: 8, note: 'Para arrancar y sostener el hábito' },
  { classes: 12, note: 'El equilibrio ideal de frecuencia' },
  { classes: 16, note: 'Máxima constancia y seguimiento' },
];

export const LiveClasses: React.FC = () => {
  const whatsappUrl = buildWhatsappUrl(LIVE_MESSAGE);
  const trialUrl = buildWhatsappUrl(TRIAL_MESSAGE);

  return (
    <section id="vivo" className="relative overflow-hidden py-20 lg:py-28 bg-stone-950 text-white">
      {/* Glow de marca */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#E0006C]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-24 w-[26rem] h-[26rem] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-[#FF6FA5]" />
              Modalidad en Vivo · Cupos limitados
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
              Clases en <span className="italic text-[#FF8FBD]">Vivo</span>
            </h2>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-5">
              Bajo esta modalidad se pueden elegir <strong className="text-white">paquetes de 8, 12 o 16 clases en vivo mensuales</strong>,
              con seguimiento personalizado por Zoom y adaptado a las circunstancias de cada
              TotalHiiter. Además incluye el acceso a la comunidad, la nutrición, el seguimiento
              privado y mucho más.
            </p>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8">
              Si quieres ser parte de esta modalidad, contáctanos por WhatsApp y evaluamos tu caso
              de forma privada.
            </p>

            {/* Paquetes */}
            <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.classes}
                  className="rounded-2xl bg-white/5 border border-white/15 px-3 py-4 text-center backdrop-blur-sm"
                  title={pkg.note}
                >
                  <p className="font-extrabold text-3xl leading-none text-white">{pkg.classes}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1.5">
                    clases / mes
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70 mb-8">
              <span className="inline-flex items-center gap-1.5">
                <Video className="w-4 h-4 text-[#FF8FBD]" /> Por Zoom
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FF8FBD]" /> Comunidad privada
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#FF8FBD]" /> Seguimiento personalizado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-[#FF8FBD]" /> Nutrición incluida
              </span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#E0006C] hover:bg-[#C2005A] text-white font-bold text-base shadow-lg shadow-[#E0006C]/40 hover:shadow-xl hover:shadow-[#E0006C]/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Consultar por WhatsApp
            </a>
          </div>

          {/* Video en bucle */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-black/60 bg-stone-900">
              <video
                className="w-full aspect-video object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/images/user/totalhiit_2.jpg"
                aria-label="Entrenamiento TOTALHIIT en bucle"
              >
                <source src="/videos/entrenamiento.mp4" type="video/mp4" />
                Tu navegador no soporta video HTML5.
              </video>

              <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Entrenamiento en vivo
              </div>
            </div>
          </div>
        </div>

        {/* Banner clase gratis */}
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E0006C] via-[#FF2E86] to-amber-400 shadow-[0_0_60px_rgba(224,0,108,0.45)]">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_15%_20%,white,transparent_45%)] pointer-events-none" />
          <div className="relative px-6 py-7 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shrink-0 shadow-inner">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/90 mb-1">
                  Bonus de bienvenida
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase leading-tight text-white drop-shadow">
                  ¡Aprovecha que tienes una clase gratis de prueba!
                </p>
              </div>
            </div>

            <a
              href={trialUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-6 py-3.5 rounded-full bg-white text-[#A30049] font-extrabold text-sm shadow-lg shadow-black/20 hover:bg-amber-50 hover:-translate-y-0.5 transition-all"
            >
              Reclamar mi clase
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
