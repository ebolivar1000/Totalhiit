import React from 'react';
import { Apple, Flame, HeartHandshake, Sparkles, UtensilsCrossed, Zap } from 'lucide-react';

export const NutritionPillars: React.FC = () => {
  const pillars = [
    {
      icon: <Flame className="w-6 h-6 text-rose-500" />,
      title: 'Nutrición Antiinflamatoria',
      desc: 'Alimentos reales ricos en antioxidantes y grasas saludables (Omega-3) que reducen dolores articulares y fatiga.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Proteína Óptima para Masa Muscular',
      desc: 'Estrategias de ingesta proteica para proteger tu masa magra, activar el gasto metabólico y prevenir la sarcopenia.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: 'Equilibrio Hormonal Natural',
      desc: 'Pautas nutricionales diseñadas para estabilizar picos de glucosa y acompañar los cambios de la perimenopausia y menopausia.'
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-emerald-500" />,
      title: 'Menús Fáciles y Sin Dietas Extremas',
      desc: 'Recetas prácticas y accesibles para toda la familia. Cero prohibiciones absurdas ni conteos obsesivos de calorías.'
    }
  ];

  return (
    <section id="nutricion" className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Apple className="w-3.5 h-3.5" />
              Pilar de Nutrición TOTALHIIT
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-6">
              Alimentar tu cuerpo, no castigarlo.
            </h2>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-6">
              A los 40 años, las dietas restrictivas ya no funcionan y solo ralentizan tu tiroides y metabolismo. Necesitas un combustible inteligente que te dé vitalidad desde la primera hora de la mañana.
            </p>

            <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Guía de Recetas y Menú Semanal</h4>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                    Incluido en el bootcamp: plantillas de compras, listas de intercambios y opciones deliciosas para preparar en 20 minutos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-5">
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">
                    {p.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
