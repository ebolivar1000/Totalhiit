import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BootcampModules } from './components/BootcampModules';
import { NutritionPillars } from './components/NutritionPillars';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { VideoItem } from './data/bootcampData';

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const handleOpenPricing = () => {
    const el = document.getElementById('precios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-rose-200 selection:text-rose-900">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs font-semibold py-2 px-4 text-center">
        <span>✨ Inscripciones abiertas para el nuevo ciclo de <strong>Bootcamp TOTAL+40</strong> · Acceso inmediato a las 12 clases y recetario</span>
      </div>

      {/* Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        onOpenPricing={handleOpenPricing}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          onPlayVideo={(v) => setActiveVideo(v)}
          onOpenPricing={handleOpenPricing}
        />

        <BootcampModules
          onPlayVideo={(v) => setActiveVideo(v)}
        />

        <NutritionPillars />

        <Pricing
          currency={currency}
          setCurrency={setCurrency}
        />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Video Modal Player */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};

export default App;
