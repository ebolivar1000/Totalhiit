import React from 'react';
import { X, ExternalLink, Lock, CheckCircle, Sparkles, Play } from 'lucide-react';
import { VideoItem } from '../data/bootcampData';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
  onOpenPricing: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, onOpenPricing }) => {
  if (!video) return null;

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-950/70">
          <div className="flex-1 pr-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              {video.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {video.type === 'intro' ? 'Clase de Muestra' : video.type === 'stretching' ? 'Estiramiento & Movilidad' : 'Clase del Bootcamp'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{video.title}</h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {video.isLocked ? (
          /* Locked Content conversion card */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Thumbnail with lock overlay */}
            <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden relative shadow-lg mb-6 border border-stone-800">
              <img
                src={video.image}
                alt={video.title}
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-stone-950/50 flex flex-col items-center justify-center p-4 text-white">
                <div className="w-14 h-14 rounded-full bg-rose-600/90 flex items-center justify-center shadow-lg shadow-rose-600/50 mb-2">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                  Contenido Exclusivo
                </span>
                <span className="text-[11px] text-stone-300 mt-0.5">
                  Duración: {video.duration}
                </span>
              </div>
            </div>

            <h4 className="font-serif-display text-2xl font-bold text-white mb-2">
              Esta clase es parte del Bootcamp TOTAL+40
            </h4>
            <p className="text-stone-400 text-sm max-w-lg mb-6 leading-relaxed">
              {video.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full max-w-md bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80 mb-6 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>12 Clases completas en video</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Guía nutricional antiinflamatoria</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Rutinas de estiramiento y movilidad</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Acceso 100% online y a tu ritmo</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Desbloquear el Bootcamp</span>
              </button>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ya soy alumna</span>
              </a>
            </div>
          </div>
        ) : (
          /* Unlocked video (Intro) */
          <>
            <div className="relative pb-[56.25%] h-0 bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5 bg-stone-900 text-stone-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-800">
              <div className="flex-1">
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{video.description}</p>
              </div>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir en YouTube</span>
              </a>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
