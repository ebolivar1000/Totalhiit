import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSectionCinematic: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: '¿Tengo más de 40 años y hace tiempo no entreno, este programa es para mí?',
      a: '¡Totalmente! El Bootcamp TOTAL+40 está estructurado progresivamente. La primera semana comienza con activación de base y movilidad, asegurando que despiertes tus músculos sin sobrecargar tu sistema cardiovascular ni tus articulaciones.',
    },
    {
      q: '¿Qué pasa si tengo problemas o dolores en las rodillas o espalda baja?',
      a: 'Todas las clases están diseñadas con versiones de bajo impacto ("no jumping"). No hay saltos bruscos que impacten tus cartílagos. Además, cuentas con rutinas específicas de estiramiento y movilidad para liberar tensiones.',
    },
    {
      q: '¿Qué equipo o material necesito para hacer las clases?',
      a: 'Únicamente una colchoneta (mat), ropa cómoda y ganas de empezar. Opcionalmente, para la semana 3 y 4 puedes sumar un par de mancuernas ligeras (1 a 2 kg) o botellas de agua para intensificar la tonificación.',
    },
    {
      q: '¿Cómo funcionan los pagos con Wise y Mercado Pago?',
      a: 'Elige tu región y transfiere por el medio indicado: si vives fuera de Argentina, seleccionas USD y te mostramos los datos de Wise; si vives en Argentina, seleccionas ARS y transfieres por Mercado Pago o tu banco con alias/CBU. En ambos casos envías tu comprobante por WhatsApp para activar tu acceso al instante.',
    },
    {
      q: '¿Los videos caducan o tengo horarios fijos?',
      a: 'No tienes horarios fijos. Una vez adquieres el Bootcamp, puedes ver las 12 clases cuando mejor se adapte a tu agenda diaria, repitiéndolas las veces que quieras desde tu móvil, tablet o Smart TV.',
    },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-stone-950 text-white border-t border-white/10 relative overflow-hidden scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FF8FBD] text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF6FA5]" />
            Preguntas Frecuentes
          </div>
          <h2 className="font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            ¿Tienes dudas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA5] to-rose-400">antes de comenzar?</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Respuestas claras para que des el primer paso con total confianza.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-stone-900/60 rounded-2xl border border-white/10 overflow-hidden transition-all backdrop-blur-md"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="font-archivo text-base sm:text-lg font-bold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF6FA5] transition-transform shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
