import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: '¿Tengo más de 40 años y hace tiempo no entreno, este programa es para mí?',
      a: '¡Totalmente! El Bootcamp TOTAL+40 está estructurado progresivamente. La primera semana comienza con activación de base y movilidad, asegurando que despiertes tus músculos sin sobrecargar tu sistema cardiovascular ni tus articulaciones.'
    },
    {
      q: '¿Qué pasa si tengo problemas o dolores en las rodillas o espalda baja?',
      a: 'Todas las clases están diseñadas con versiones de bajo impacto ("no jumping"). No hay saltos bruscos que impacten tus cartílagos. Además, cuentas con dos rutinas específicas de estiramiento y movilidad para liberar tensiones.'
    },
    {
      q: '¿Qué equipo o material necesito para hacer las clases?',
      a: 'Únicamente una colchoneta (mat), ropa cómoda y ganas de empezar. Opcionalmente, para la semana 3 y 4 puedes sumar un par de mancuernas ligeras (1 a 2 kg) o botellas de agua para intensificar la tonificación.'
    },
    {
      q: '¿Cómo funcionan los pagos con Wise y Mercado Pago?',
      a: 'Elige tu región y transfiere por el medio que te aparece en pantalla: si vives fuera de Argentina, seleccionas USD y te mostramos los datos de la cuenta Wise para transferir en dólares; si vives en Argentina, seleccionas ARS y te mostramos el CBU para transferir por Mercado Pago o tu banco. En ambos casos guardas el comprobante y lo envías por WhatsApp para activar tu acceso.'
    },
    {
      q: '¿Los videos caducan o tengo horarios fijos?',
      a: 'No tienes horarios fijos. Una vez adquieres el Bootcamp, puedes ver las 12 clases y los videos de movilidad cuando mejor se adapte a tu agenda diaria, repitiéndolas las veces que quieras desde tu móvil, tablet o Smart TV.'
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-stone-50 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            Preguntas Frecuentes
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            ¿Tienes dudas antes de comenzar?
          </h2>
          <p className="text-stone-600 text-base mt-2">
            Respuestas claras para que des el primer paso con total confianza.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left font-bold text-stone-900 flex items-center justify-between gap-4 hover:text-rose-600 transition-colors"
                >
                  <span className="text-base sm:text-lg">{f.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-4">
                    {f.a}
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
