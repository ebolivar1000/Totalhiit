import React from 'react';
import { Check, ShieldCheck, Zap, Globe, CreditCard, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';

interface PricingSectionCinematicProps {
  currency: 'USD' | 'ARS';
  setCurrency: (c: 'USD' | 'ARS') => void;
  onSelectPayment: (method: 'wise' | 'mercadopago', planName: string, amount: string) => void;
}

const doublePrice = (value: string): string => {
  const match = value.match(/^(.*?)(\d[\d.,]*)(.*)$/);
  if (!match) return value;

  const [, prefix, raw, suffix] = match;
  const thousandsDot = /^\d{1,3}(\.\d{3})+$/.test(raw);
  const thousandsComma = /^\d{1,3}(,\d{3})+$/.test(raw);
  const decimalDot = /^\d+\.\d{1,2}$/.test(raw);
  const decimalComma = /^\d+,\d{1,2}$/.test(raw);

  let numeric: number;
  if (thousandsDot) numeric = Number(raw.replace(/\./g, ''));
  else if (thousandsComma) numeric = Number(raw.replace(/,/g, ''));
  else if (decimalComma) numeric = Number(raw.replace(',', '.'));
  else if (decimalDot) numeric = Number(raw);
  else numeric = Number(raw.replace(/[.,]/g, ''));

  if (!Number.isFinite(numeric)) return value;

  const doubled = numeric * 2;
  let formatted: string;
  if (thousandsDot) formatted = doubled.toLocaleString('es-AR', { maximumFractionDigits: 0 });
  else if (thousandsComma) formatted = doubled.toLocaleString('en-US', { maximumFractionDigits: 0 });
  else if (decimalDot) formatted = doubled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  else if (decimalComma) formatted = doubled.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  else formatted = String(doubled);

  return `${prefix}${formatted}${suffix}`;
};

export const PricingSectionCinematic: React.FC<PricingSectionCinematicProps> = ({
  currency,
  setCurrency,
  onSelectPayment,
}) => {
  const isUSD = currency === 'USD';
  const { prices: editablePrices } = useSiteContent();

  const prices = {
    bootcamp: isUSD ? editablePrices.bootcampUSD : editablePrices.bootcampARS,
    annual: isUSD ? editablePrices.annualUSD : editablePrices.annualARS,
    unit: isUSD ? 'USD' : 'ARS',
  };

  const handleChoose = (planName: string, amount: string) => {
    onSelectPayment(isUSD ? 'wise' : 'mercadopago', planName, amount);
  };

  return (
    <section id="precios" className="py-24 lg:py-32 bg-stone-900 text-white border-t border-white/10 relative overflow-hidden scroll-mt-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0006C]/20 border border-[#FF6FA5]/40 text-[#FF8FBD] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            Inversión en tu Salud y Vitalidad
          </div>
          
          <h2 className="font-archivo text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Elige el plan ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA5] to-rose-400">para ti</span>
          </h2>
          
          <p className="text-white/70 text-base sm:text-lg">
            Acceso inmediato al Bootcamp TOTAL+40, todas las clases en video, recetarios y comunidad de apoyo.
          </p>

          {/* Currency Switcher */}
          <div className="mt-8 inline-flex items-center bg-stone-950 p-1.5 rounded-2xl border border-white/15 shadow-inner">
            <button
              onClick={() => setCurrency('USD')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isUSD
                  ? 'bg-gradient-to-r from-[#E0006C] to-rose-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Dólares (USD)</span>
            </button>
            <button
              onClick={() => setCurrency('ARS')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                !isUSD
                  ? 'bg-gradient-to-r from-[#E0006C] to-rose-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Pesos (ARS)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Bootcamp Total+40 */}
          <div className="relative bg-stone-950/80 rounded-3xl p-8 sm:p-10 border border-white/15 flex flex-col justify-between text-left backdrop-blur-xl hover:border-[#FF6FA5]/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF8FBD]">
                  Plan Ciclo Único
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                  Acceso 3 Meses
                </span>
              </div>

              <h3 className="font-archivo text-2xl sm:text-3xl font-black text-white mb-2">
                Bootcamp TOTAL+40
              </h3>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">
                Ideal para comenzar tu transformación paso a paso y aprender el método definitivo.
              </p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="font-archivo text-5xl sm:text-6xl font-black text-white tracking-tight">
                    {prices.bootcamp}
                  </span>
                  <span className="text-sm font-bold text-white/50">{prices.unit}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="line-through text-white/40">{doublePrice(prices.bootcamp)} {prices.unit}</span>
                  <span className="text-emerald-400 font-bold">50% OFF Lanzamiento</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 text-xs text-white/80">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>12 Clases progresivas en video de bajo impacto articular</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>Guía Nutricional Antiinflamatoria descargable</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>Acceso gratuito a la NUEVA App TotalHiiT</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>Comunidad privada de alumnas</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Bootcamp TOTAL+40', prices.bootcamp)}
              className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Elegir Plan Ciclo</span>
              <ArrowRight className="w-4 h-4 text-[#FF6FA5]" />
            </button>
          </div>

          {/* Card 2: Plan Anual VIP (Destacado) */}
          <div className="relative bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl p-8 sm:p-10 border-2 border-[#FF6FA5]/60 flex flex-col justify-between text-left shadow-[0_0_40px_rgba(224,0,108,0.2)]">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E0006C] to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
              Más Recomendado
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF8FBD]">
                  Membresía Completa
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E0006C]/20 text-[#FF8FBD] border border-[#FF6FA5]/30">
                  Acceso 12 Meses
                </span>
              </div>

              <h3 className="font-archivo text-2xl sm:text-3xl font-black text-white mb-2">
                Pase Anual TOTAL+40
              </h3>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">
                Para consolidar tu estilo de vida, mantener tu peso y salud hormonal todo el año.
              </p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="font-archivo text-5xl sm:text-6xl font-black text-white tracking-tight">
                    {prices.annual}
                  </span>
                  <span className="text-sm font-bold text-white/50">{prices.unit}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="line-through text-white/40">{doublePrice(prices.annual)} {prices.unit}</span>
                  <span className="text-[#FF6FA5] font-bold">Ahorro Máximo Anual</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 text-xs text-white/80">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">Todo lo del Bootcamp + Nuevas rutinas mensuales</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>Soporte prioritario y seguimiento continuo</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>App TotalHiiT con funciones premium activadas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6FA5] shrink-0 mt-0.5" />
                  <span>Acceso a masterclasses de salud hormonal</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Pase Anual TOTAL+40', prices.annual)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E0006C] to-rose-600 hover:from-rose-600 hover:to-[#E0006C] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Comenzar con Pase Anual</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Security badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-white/50">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Pago 100% seguro y encriptado · Activación automática inmediata</span>
        </div>

      </div>
    </section>
  );
};
