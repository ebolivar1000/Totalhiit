import React, { useState } from 'react';
import { KineticLiveClassesHero } from './KineticLiveClassesHero';
import { ClassesFourWeeksSection } from './ClassesFourWeeksSection';
import { BootcampIntroSection } from './BootcampIntroSection';
import { AppSectionCinematic } from './AppSectionCinematic';
import { NutritionSectionCinematic } from './NutritionSectionCinematic';
import { PricingSectionCinematic } from './PricingSectionCinematic';
import { FAQSectionCinematic } from './FAQSectionCinematic';
import { Footer } from '../Footer';
import { VideoModal } from '../VideoModal';
import { PaymentModal } from '../PaymentModal';
import { VideoItem } from '../../data/bootcampData';
import { useSiteContent } from '../../hooks/useSiteContent';
import { Menu, X } from 'lucide-react';

type PaymentSelection = {
  method: 'wise' | 'mercadopago';
  planName: string;
  amount: string;
};

export const DemoCinematicLanding: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [payment, setPayment] = useState<PaymentSelection | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { videos } = useSiteContent();

  const handleOpenPricing = () => {
    const el = document.getElementById('precios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleOpenVideo = (video: VideoItem) => {
    const override = videos[video.id];
    setActiveVideo(override ? { ...video, youtubeId: override } : video);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-white selection:bg-[#E0006C] selection:text-white font-sans antialiased">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#E0006C] via-rose-600 to-amber-500 text-white text-xs font-bold py-2 px-4 text-center z-50">
        <span>✨ Inscripciones abiertas para el nuevo ciclo de <strong>Bootcamp TOTAL+40</strong> · Acceso inmediato a clases y recetario</span>
      </div>

      {/* Cinematic Sticky Navbar */}
      <nav className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('vivo')}>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white ring-1 ring-white/20 shadow-md">
                <img
                  src="/images/logo_valen.jpeg"
                  alt="TOTALHIIT"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-edo text-[26px] leading-[1.0] text-white">
                  TOTAL<span className="text-[#FF6FA5]">HIIT</span>
                </span>
                <span className="font-edo text-[11px] leading-[1.2] text-[#FF8FBD] tracking-wider uppercase">
                  Bootcamp 40
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-white/80">
              <button onClick={() => scrollTo('vivo')} className="hover:text-[#FF6FA5] transition-colors cursor-pointer">
                Clases en Vivo
              </button>
              <button onClick={() => scrollTo('clases-4-semanas')} className="hover:text-[#FF6FA5] transition-colors cursor-pointer">
                Programas
              </button>
              <button onClick={() => scrollTo('bootcamp')} className="hover:text-[#FF6FA5] transition-colors cursor-pointer">
                Bootcamp
              </button>
              <button onClick={() => scrollTo('app-totalhiit')} className="text-[#FF6FA5] hover:text-white transition-colors cursor-pointer font-black">
                App TotalHiiT
              </button>
              <button onClick={() => scrollTo('nutricion')} className="hover:text-[#FF6FA5] transition-colors cursor-pointer">
                Nutrición +40
              </button>
              <button onClick={() => scrollTo('precios')} className="hover:text-[#FF6FA5] transition-colors cursor-pointer">
                Precios
              </button>
              <button onClick={() => scrollTo('faq')} className="hover:text-[#FF6FA5] transition-colors cursor-pointer">
                Preguntas
              </button>
            </div>

            {/* Currency & CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/15 text-xs">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currency === 'USD' ? 'bg-[#E0006C] text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('ARS')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currency === 'ARS' ? 'bg-[#E0006C] text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  ARS (AR$)
                </button>
              </div>

              <button
                onClick={handleOpenPricing}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E0006C] to-rose-600 hover:from-rose-600 hover:to-[#E0006C] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                Unirme Ahora
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-stone-950 border-b border-white/10 px-6 py-6 space-y-4 text-left">
            <button onClick={() => scrollTo('vivo')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2">
              Clases en Vivo
            </button>
            <button onClick={() => scrollTo('clases-4-semanas')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2">
              Programas
            </button>
            <button onClick={() => scrollTo('bootcamp')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2">
              Bootcamp
            </button>
            <button onClick={() => scrollTo('app-totalhiit')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2 text-[#FF6FA5]">
              App TotalHiiT
            </button>
            <button onClick={() => scrollTo('nutricion')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2">
              Nutrición +40
            </button>
            <button onClick={() => scrollTo('precios')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2">
              Precios
            </button>
            <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm font-bold uppercase tracking-wider py-2">
              Preguntas
            </button>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center bg-white/10 p-1 rounded-full text-xs">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-full font-bold ${currency === 'USD' ? 'bg-[#E0006C] text-white' : 'text-white/60'}`}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('ARS')}
                  className={`px-3 py-1 rounded-full font-bold ${currency === 'ARS' ? 'bg-[#E0006C] text-white' : 'text-white/60'}`}
                >
                  ARS
                </button>
              </div>
              <button
                onClick={handleOpenPricing}
                className="px-5 py-2 rounded-full bg-[#E0006C] text-white text-xs font-bold uppercase"
              >
                Unirme
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. SECCION 1: Video entrenamiento.mp4 en bucle con Kinetic Typography */}
        <KineticLiveClassesHero />

        {/* 2. SECCION 2: Clases (4 semanas) con video entrenamiento.mp4 de fondo */}
        <ClassesFourWeeksSection
          onSelectVideo={handleOpenVideo}
          onOpenPricing={handleOpenPricing}
        />

        {/* 3. SECCION 3: Bootcamp con video intro-totalhiit.mp4 de fondo */}
        <BootcampIntroSection
          onPlayVideo={handleOpenVideo}
          onOpenPricing={handleOpenPricing}
        />

        {/* 4. SECCION 4: APP TotalHiit con video vertical CORTO sin bandas negras */}
        <AppSectionCinematic onOpenPricing={handleOpenPricing} />

        {/* 5. SECCION 5: Nutrición +40 */}
        <NutritionSectionCinematic />

        {/* 6. SECCION 6: Precios */}
        <PricingSectionCinematic
          currency={currency}
          setCurrency={setCurrency}
          onSelectPayment={(method, planName, amount) =>
            setPayment({ method, planName, amount })
          }
        />

        {/* 7. SECCION 7: Preguntas */}
        <FAQSectionCinematic />
      </main>

      {/* 8. SECCION 8: Footer */}
      <Footer />

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          onOpenPricing={handleOpenPricing}
        />
      )}

      {/* Payment Modal */}
      {payment && (
        <PaymentModal
          method={payment.method}
          planName={payment.planName}
          amount={payment.amount}
          onClose={() => setPayment(null)}
        />
      )}

    </div>
  );
};
