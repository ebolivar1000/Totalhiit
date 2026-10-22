import React from 'react';
import { Check, ShieldCheck, Zap, Globe, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

interface PricingProps {
  currency: 'USD' | 'ARS';
  setCurrency: (c: 'USD' | 'ARS') => void;
  onSelectPayment: (method: 'wise' | 'mercadopago', planName: string, amount: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ currency, setCurrency, onSelectPayment }) => {
  const isUSD = currency === 'USD';
  const { prices: editablePrices } = useSiteContent();

  // Precios editables desde /admin.html
  const prices = {
    bootcamp: isUSD ? editablePrices.bootcampUSD : editablePrices.bootcampARS,
    annual: isUSD ? editablePrices.annualUSD : editablePrices.annualARS,
    unit: isUSD ? 'USD' : 'ARS'
  };

  const handleChoose = (planName: string, amount: string) => {
    onSelectPayment(isUSD ? 'wise' : 'mercadopago', planName, amount);
  };

  return (
    <section id="precios" className="py-20 lg:py-28 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F6] text-[#E0006C] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FCE7F1]">
            <Zap className="w-3.5 h-3.5" />
            Inversión en tu Salud y Vitalidad
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            Elige el plan que mejor se adapte a ti
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Acceso inmediato al Bootcamp TOTAL+40, todas las clases en video, recetarios y comunidad de apoyo.
          </p>

          {/* Currency Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-stone-100 border border-stone-200">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isUSD
                  ? 'bg-white text-stone-900 shadow-md shadow-stone-200'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              Internacional (USD vía Wise)
            </button>
            <button
              onClick={() => setCurrency('ARS')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                !isUSD
                  ? 'bg-white text-stone-900 shadow-md shadow-stone-200'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-sky-500" />
              Argentina (ARS vía Mercado Pago)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: Bootcamp 4 Semanas */}
          <div className="bg-stone-50 rounded-3xl p-8 sm:p-10 border border-stone-200 flex flex-col justify-between text-left relative">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Programa Intensivo
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Bootcamp TOTAL+40
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                El curso completo de 4 semanas para resetear tu fuerza, cuerpo y energía.
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-stone-900">
                  {prices.bootcamp}
                </span>
                <span className="text-sm font-semibold text-stone-500">
                  {prices.unit} / pago único
                </span>
              </div>

              <ul className="space-y-3.5 text-sm text-stone-700 pt-6 border-t border-stone-200">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Acceso completo a las <strong>12 clases del Bootcamp</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Video de Introducción y guía de inicio</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>2 Clases complementarias de estiramiento y movilidad</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Guía nutricional antiinflamatoria en PDF</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Acceso durante 6 meses para repetir a tu ritmo</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Bootcamp TOTAL+40 (4 Semanas)', `${prices.bootcamp} ${prices.unit}`)}
              className="mt-8 w-full py-4 rounded-full bg-stone-900 hover:bg-[#E0006C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Pagar con {isUSD ? 'Wise (USD)' : 'Mercado Pago (CBU)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Membresía Total Anual (Highlighted in Magenta Red) */}
          <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 flex flex-col justify-between text-left relative shadow-2xl shadow-[#E0006C]/10">
            {/* Best Value Badge in Magenta Red */}
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-[#E0006C] to-[#C2005A] text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
              Más Popular & Ahorro
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D94]">
                Pase Anual Completo
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">
                TOTALHIIT Club Anual
              </h3>
              <p className="text-stone-400 text-sm mb-6">
                Todas las rutinas pasadas, presentes y futuras, además del Bootcamp +40.
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  {prices.annual}
                </span>
                <span className="text-sm font-semibold text-stone-400">
                  {prices.unit} / año completo
                </span>
              </div>

              <ul className="space-y-3.5 text-sm text-stone-300 pt-6 border-t border-stone-800">
                <li className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#FF4D94] shrink-0" />
                  <span><strong>Todo lo incluido</strong> en el Bootcamp TOTAL+40</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Biblioteca completa de rutinas HIIT sin impacto</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Nuevos menús y recetarios mensuales</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Acceso a la comunidad privada de mujeres +40</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E0006C] shrink-0" />
                  <span>Sesiones mensuales de preguntas y respuestas en vivo</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('TOTALHIIT Club Anual', `${prices.annual} ${prices.unit}`)}
              className="mt-8 w-full py-4 rounded-full bg-[#E0006C] hover:bg-[#C2005A] text-white font-bold text-sm shadow-lg shadow-[#E0006C]/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Unirme con {isUSD ? 'Wise (USD)' : 'Mercado Pago (CBU)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Security badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pagos encriptados y 100% seguros</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Wise: Cuenta oficial de Eliani Valentina Planchez (USD)</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-500" />
            <span>Mercado Pago: Transferencia directa a CBU (ARS)</span>
          </div>
        </div>

      </div>
    </section>
  );
};
