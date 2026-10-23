import React from 'react';
import { Heart } from 'lucide-react';
import { INSTAGRAM_URL, YOUTUBE_URL } from '../data/contact';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white ring-1 ring-stone-700 shadow-md">
                <img
                  src="/images/logo_valen.jpeg"
                  alt="TOTALHIIT"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-edo text-[26px] leading-[1.1] text-white">
                  TOTAL<span className="text-rose-500">HIIT</span>
                </span>
                <span className="font-edo text-[12px] leading-[1.3] text-stone-500">
                  Bootcamp +40
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed mb-6">
              Plataforma y Bootcamp de entrenamiento HIIT de impacto adaptado y nutrición para mujeres de más de 40 años que desean recuperar su fuerza, agilidad y vitalidad.
            </p>
            <div className="flex items-center gap-4 text-stone-400">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-rose-600 transition-colors"
                title="Instagram @totalhiit1"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-rose-600 transition-colors"
                title="YouTube TotalHIIT"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-4">
              Programa
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#clases" className="hover:text-white transition-colors">Bootcamp TOTAL+40</a></li>
              <li><a href="#clases" className="hover:text-white transition-colors">12 Clases en Video</a></li>
              <li><a href="#clases" className="hover:text-white transition-colors">Estiramientos & Movilidad</a></li>
              <li><a href="#nutricion" className="hover:text-white transition-colors">Guía Nutricional +40</a></li>
            </ul>
          </div>

          {/* Legal / Payment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-4">
              Pagos Seguros
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>• Wise (USD Internacional)</li>
              <li>• Mercado Pago (ARS Argentina)</li>
              <li>• Acceso inmediato vía e-mail</li>
              <li>• Soporte personalizado</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} TOTALHIIT. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para mujeres de todo el mundo.
          </p>
        </div>

      </div>
    </footer>
  );
};
