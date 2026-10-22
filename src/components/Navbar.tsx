import React, { useState } from 'react';
import { Globe, Menu, X, CreditCard } from 'lucide-react';

interface NavbarProps {
  currency: 'USD' | 'ARS';
  setCurrency: (c: 'USD' | 'ARS') => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currency, setCurrency, onOpenPricing }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white ring-1 ring-stone-200 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <img
              src="/images/certificado.jpg"
              alt="Certificación TOTALHIIT"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-edo text-[28px] leading-[1.1] text-stone-900">
              TOTAL<span className="text-rose-600">HIIT</span>
            </span>
            <span className="font-edo text-[13px] leading-[1.3] text-stone-500">
              Bootcamp +40
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-stone-600">
          <a href="#programa" className="hover:text-rose-600 transition-colors">El Bootcamp</a>
          <a href="#clases" className="hover:text-rose-600 transition-colors">Clases (4 Semanas)</a>
          <a href="#nutricion" className="hover:text-rose-600 transition-colors">Nutrición +40</a>
          <a href="#precios" className="hover:text-rose-600 transition-colors">Precios</a>
          <a href="#vivo" className="hover:text-rose-600 transition-colors">Clases en Vivo</a>
          <a href="#faq" className="hover:text-rose-600 transition-colors">Preguntas</a>
        </nav>

        {/* Right Action & Currency Switcher */}
        <div className="hidden md:flex items-center gap-4">
          {/* Currency Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                currency === 'USD'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Pagos internacionales vía Wise en USD"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('ARS')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                currency === 'ARS'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Pagos en Argentina vía Mercado Pago en ARS"
            >
              <CreditCard className="w-3.5 h-3.5 text-sky-500" />
              ARS (AR$)
            </button>
          </div>

          <button
            onClick={onOpenPricing}
            className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-rose-600 text-white text-sm font-semibold shadow-md shadow-stone-900/10 hover:shadow-rose-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Unirme Ahora
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 text-xs font-bold rounded-md ${
                currency === 'USD' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('ARS')}
              className={`px-2 py-1 text-xs font-bold rounded-md ${
                currency === 'ARS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              ARS
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <a
            href="#programa"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            El Bootcamp
          </a>
          <a
            href="#clases"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            Clases (4 Semanas)
          </a>
          <a
            href="#nutricion"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            Nutrición +40
          </a>
          <a
            href="#precios"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            Precios
          </a>
          <a
            href="#vivo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            Clases en Vivo
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            Preguntas
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPricing();
            }}
            className="w-full mt-2 py-3 rounded-xl bg-rose-600 text-white font-semibold text-center shadow-md shadow-rose-600/20"
          >
            Unirme al Bootcamp
          </button>
        </div>
      )}
    </header>
  );
};
