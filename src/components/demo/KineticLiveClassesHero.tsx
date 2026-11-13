import React, { useEffect, useState, useRef } from 'react';
import { Gift, Radio, ArrowDown, MessageCircle } from 'lucide-react';
import { buildWhatsappUrl } from '../../data/contact';

const LIVE_MESSAGE =
  '¡Hola! Me interesa la modalidad de Clases en Vivo de TOTALHIIT. Quiero evaluar mi caso de forma privada y conocer los paquetes de 8, 12 o 16 clases mensuales por Zoom.';

const TRIAL_MESSAGE =
  '¡Hola! Quiero aprovechar mi clase gratis de prueba de TOTALHIIT. ¿Cómo coordino el día y horario?';

const PACKAGES = [
  { classes: 8, note: 'Para arrancar y sostener el hábito' },
  { classes: 12, note: 'El equilibrio ideal de frecuencia' },
  { classes: 16, note: 'Máxima constancia y seguimiento' },
];

export const KineticLiveClassesHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const whatsappUrl = buildWhatsappUrl(LIVE_MESSAGE);
  const trialUrl = buildWhatsappUrl(TRIAL_MESSAGE);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress between 0 (top of section at viewport top) and 1 (scrolled past)
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;
      
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kinetic typography transformations tied to scroll (Explosión dinámica multidireccional)
  // Phase 1 (0 to 0.45): Separación desordenada y moderna de palabras
  const headlineFade = Math.max(1 - scrollProgress * 2.2, 0);
  const word1Transform = `translate3d(${-scrollProgress * 320}px, ${-scrollProgress * 260}px, 0) rotate(${-scrollProgress * 16}deg) scale(${1 - scrollProgress * 0.15})`;
  const word2Transform = `translate3d(${-scrollProgress * 40}px, ${-scrollProgress * 380}px, 0) rotate(${scrollProgress * 22}deg) scale(${1 + scrollProgress * 0.25})`;
  const word3Transform = `translate3d(${scrollProgress * 360}px, ${-scrollProgress * 180}px, 0) rotate(${scrollProgress * 20}deg) scale(${1 + scrollProgress * 0.3})`;
  const sub1Transform = `translate3d(${-scrollProgress * 240}px, ${scrollProgress * 180}px, 0) rotate(${-scrollProgress * 10}deg)`;
  const sub2Transform = `translate3d(${scrollProgress * 260}px, ${scrollProgress * 220}px, 0) rotate(${scrollProgress * 12}deg)`;

  // Phase 2 (0.25 to 1.0): Content reveal from below
  const contentProgress = Math.min(Math.max((scrollProgress - 0.25) / 0.5, 0), 1);
  const contentOpacity = contentProgress;
  const contentTranslateY = (1 - contentProgress) * 60;

  return (
    <section ref={containerRef} id="vivo" className="relative bg-stone-950 text-white min-h-[220vh] scroll-mt-24">
      {/* Sticky Background Video Stage (Video claro y vibrante) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <video
          src="/videos/entrenamiento.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover scale-100 filter brightness-100 contrast-105"
        />

        {/* Cinematic Tint muy sutil (permite ver el video con total claridad) */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/50 via-transparent to-stone-950/30 pointer-events-none" />

        {/* Ambient Brand Glow muy suave */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#E0006C]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Floating Content Stage (Overlays the sticky video) */}
      <div className="relative z-10 -mt-[100vh] min-h-[220vh] flex flex-col justify-between pointer-events-none">
        
        {/* Scene 1: Kinetic Opening Headline */}
        <div
          className={`h-screen w-full flex flex-col items-center justify-center text-center px-4 transition-transform duration-75 ${
            headlineFade <= 0.05 ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
          style={{ opacity: headlineFade }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0006C]/25 border border-[#FF6FA5]/40 text-[#FF8FBD] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
            <Radio className="w-3.5 h-3.5 text-[#FF6FA5] animate-pulse" />
            Modalidad en Vivo
          </div>

          <h1 className="font-archivo text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-white leading-[0.88] select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6">
            <span
              className="inline-block transition-transform duration-75 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] will-change-transform"
              style={{ transform: word1Transform }}
            >
              CLASES
            </span>
            <span
              className="inline-block text-[#FF8FBD] transition-transform duration-75 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] will-change-transform"
              style={{ transform: word2Transform }}
            >
              EN
            </span>
            <span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA5] via-rose-400 to-amber-300 transition-transform duration-75 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] will-change-transform"
              style={{ transform: word3Transform }}
            >
              VIVO
            </span>
          </h1>

          <p className="mt-8 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white max-w-xl flex flex-wrap justify-center gap-x-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            <span
              className="inline-block transition-transform duration-75 will-change-transform"
              style={{ transform: sub1Transform }}
            >
              Cupos limitados
            </span>
            <span
              className="inline-block text-[#FF8FBD] transition-transform duration-75 will-change-transform"
              style={{ transform: sub2Transform }}
            >
              por grupo
            </span>
          </p>

          <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/50 animate-bounce">
            <span className="text-[11px] font-bold uppercase tracking-widest">Desplaza hacia abajo</span>
            <ArrowDown className="w-4 h-4 text-[#FF6FA5]" />
          </div>
        </div>

        {/* Scene 2: Detailed Live Classes Info & Packages */}
        <div
          className={`h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
            contentOpacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            opacity: contentOpacity,
            transform: `translate3d(0, ${contentTranslateY}px, 0)`,
          }}
        >
          <div className="max-w-5xl w-full bg-stone-900/80 border border-white/15 rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Copy */}
              <div className="lg:col-span-7 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-[#FF8FBD] text-xs font-bold uppercase tracking-wider mb-4 border border-rose-500/30">
                  <Radio className="w-3 h-3 text-[#FF6FA5]" />
                  Seguimiento Personalizado
                </div>

                <h2 className="font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
                  Entrena con nosotros <span className="text-[#FF6FA5]">en tiempo real</span>
                </h2>

                <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-4">
                  Bajo esta modalidad se pueden elegir <strong className="text-white">paquetes de 8, 12 o 16 clases en vivo mensuales</strong>, con seguimiento personalizado por Zoom y adaptado a las circunstancias de cada TotalHiiter. Además incluye el acceso a la comunidad, la nutrición, el seguimiento privado y mucho más.
                </p>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
                  Si quieres ser parte de esta modalidad, contáctanos por WhatsApp y evaluamos tu caso de forma privada.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#E0006C] to-rose-600 hover:from-rose-600 hover:to-[#E0006C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar por WhatsApp
                  </a>

                  <a
                    href={trialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <Gift className="w-4 h-4 text-[#FF8FBD]" />
                    Clase Gratis de Prueba
                  </a>
                </div>
              </div>

              {/* Packages Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.classes}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF6FA5]/40 transition-all backdrop-blur-md flex lg:flex-row items-center justify-between gap-4 text-center lg:text-left"
                  >
                    <div>
                      <p className="font-archivo text-4xl font-black text-white leading-none">
                        {pkg.classes}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF8FBD] mt-1">
                        clases / mes
                      </p>
                    </div>
                    <p className="text-xs text-white/60 hidden sm:block lg:text-right">
                      {pkg.note}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
