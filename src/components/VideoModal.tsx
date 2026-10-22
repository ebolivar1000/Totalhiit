import React from 'react';
import { X } from 'lucide-react';
import { VideoItem } from '../data/bootcampData';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              {video.type === 'intro' ? 'Video Introductorio' : video.type === 'stretching' ? 'Estiramiento & Movilidad' : 'Clase en Video'}
            </span>
            <h3 className="text-lg font-bold text-white line-clamp-1">{video.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative pb-[56.25%] h-0 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-4 bg-stone-900 text-stone-300 text-sm">
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  );
};
