import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BootcampModules } from './components/BootcampModules';
import { NutritionPillars } from './components/NutritionPillars';
import { Pricing } from './components/Pricing';
import { LiveClasses } from './components/LiveClasses';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { PaymentModal } from './components/PaymentModal';
import { VideoItem } from './data/bootcampData';
import { useSiteContent } from './hooks/useSiteContent';

type PaymentSelection = {
  method: 'wise' | 'mercadopago';
  planName: string;
  amount: string;
};

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [payment, setPayment] = useState<PaymentSelection | null>(null);
  const { videos } = useSiteContent();

  const handleOpenPricing = () => {
    const el = document.getElementById('precios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Aplica el ID de YouTube configurado en el panel de administración (si existe)
  const handleOpenVideo = (video: VideoItem) => {
    const override = videos[video.id];
    setActiveVideo(override ? { ...video, youtubeId: override } : video);
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
          onPlayVideo={handleOpenVideo}
          onOpenPricing={handleOpenPricing}
        />

        <BootcampModules
          onSelectVideo={handleOpenVideo}
          onOpenPricing={handleOpenPricing}
        />

        <NutritionPillars />

        <Pricing
          currency={currency}
          setCurrency={setCurrency}
          onSelectPayment={(method, planName, amount) => setPayment({ method, planName, amount })}
        />

        <LiveClasses />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Video Modal Player */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onOpenPricing={handleOpenPricing}
      />

      {/* Payment Instructions Modal */}
      <PaymentModal
        method={payment?.method ?? null}
        planName={payment?.planName ?? ''}
        amount={payment?.amount ?? ''}
        onClose={() => setPayment(null)}
      />
    </div>
  );
};

export default App;
