import React from 'react';
import { Apple, Flame, Sparkles, UtensilsCrossed, Zap, HeartHandshake } from 'lucide-react';

export const NutritionSectionCinematic: React.FC = () => {
  const pillars = [
    {
      icon: <Flame className="w-6 h-6 text-rose-500" />,
      title: 'Nutrición Antiinflamatoria',
      desc: 'Alimentos reales ricos en antioxidantes y grasas saludables (Omega-3) que reducen dolores articulares y fatiga.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Proteína Óptima para Masa Muscular',
      desc: 'Estrategias de ingesta proteica para proteger tu masa magra, activar el gasto metabólico y prevenir la pérdida muscular.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF6FA5]" />,
      title: 'Equilibrio Hormonal Natural',
      desc: 'Pautas diseñadas para estabilizar la glucosa y acompañar los cambios de la perimenopausia y menopausia.',
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-emerald-400" />,
      title: 'Menús Fáciles y Sin Dietas Extremas',
      desc: 'Recetas prácticas y accesibles para toda la familia. Cero prohibiciones absurdas ni conteos obsesivos de calorías.',
    },
  ];

  return (
    <section id="nutricion" className="py-24 lg:py-32 bg-stone-950 text-white border-t border-white/10 relative overflow-hidden scroll-mt-24">
      {/* Subtle Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-5 border border-emerald-500/30">
              <Apple className="w-3.5 h-3.5" />
              Nutrición Inteligente TOTALHIIT
            </div>

            <h2 className="font-archivo text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6">
              Alimentar tu cuerpo, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                no castigarlo.
              </span>
            </h2>

            <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              A los 40 años, las dietas restrictivas ya no funcionan y solo ralentizan tu tiroides y metabolismo. Necesitas un combustible inteligente que te dé vitalidad desde la primera hora de la mañana.
            </p>

            <div className="p-5 bg-stone-900/80 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-archivo font-bold text-sm text-white mb-1">
                    Incluido en el Programa
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Recetario antiinflamatorio descargable + lista de compras semanales para que nunca dudes qué comer ni pases hambre.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-stone-900/60 border border-white/10 hover:border-emerald-500/40 transition-all backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3.5 p-3 rounded-2xl bg-white/5 w-fit border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="font-archivo font-bold text-base text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/65 leading-relaxed font-normal">
                    {item.desc}
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
