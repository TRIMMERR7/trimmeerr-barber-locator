
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { AdItem } from '../AdData';

interface VideoAdSlideProps {
  ad: AdItem;
  index: number;
  currentSlide: number;
  isTransitioning: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  isMuted: boolean;
  onAdClick: (website: string) => void;
}

const VideoAdSlide = ({ 
  ad, 
  index, 
  currentSlide, 
  isTransitioning, 
  videoRef, 
  isMuted, 
  onAdClick 
}: VideoAdSlideProps) => {
  return (
    <div
      className={`absolute inset-0 cursor-pointer transition-all duration-700 ease-in-out ${
        index === currentSlide ? 
          `translate-x-0 opacity-100 scale-100 ${isTransitioning ? 'scale-105' : ''}` : 
          index < currentSlide ? 
            '-translate-x-full opacity-0 scale-95' : 
            'translate-x-full opacity-0 scale-95'
      }`}
      onClick={() => onAdClick(ad.website)}
    >
      <div className={`relative h-full overflow-hidden transition-all duration-500 ${
        index === currentSlide && !isTransitioning ? 'hover:scale-[1.02]' : ''
      }`}>
        {/* Video Background */}
        <video
          ref={videoRef}
          src={ad.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
        />
        
        {/* Overlay with gradient and content */}
        <div className={`absolute inset-0 bg-gradient-to-br ${ad.color} backdrop-blur-sm flex flex-col justify-between p-6 relative overflow-hidden transition-all duration-700 ${
          index === currentSlide ? (isTransitioning ? 'scale-110 opacity-90' : 'scale-100 opacity-100') : 'scale-95 opacity-70'
        }`}>
          {/* Content Section */}
          <div className={`flex-1 z-10 transition-all duration-500 ${
            index === currentSlide ? (isTransitioning ? 'translate-y-2 opacity-80' : 'translate-y-0 opacity-100') : 'translate-y-4 opacity-0'
          }`}>
            <div className="text-white/90 text-sm font-semibold mb-3 tracking-wide">
              {ad.tagline}
            </div>
            <h3 className="text-white font-bold text-3xl leading-tight mb-4 drop-shadow-lg">
              {ad.company}
            </h3>
            <div className="space-y-4">
              <div className="text-white font-bold text-xl bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm inline-block shadow-lg transform transition-all duration-300 hover:scale-105">
                {ad.offer}
              </div>
              <button className="flex items-center gap-3 text-white font-semibold text-base bg-white/15 hover:bg-white/25 px-6 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 w-fit">
                {ad.ctaText}
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Decorative Elements with enhanced animations */}
          <div className={`absolute -right-12 -top-12 w-24 h-24 bg-white/5 rounded-full blur-xl transition-all duration-700 ${
            index === currentSlide ? (isTransitioning ? 'scale-150 opacity-30' : 'scale-100 opacity-100') : 'scale-75 opacity-0'
          }`}></div>
          <div className={`absolute -left-8 -bottom-8 w-16 h-16 bg-white/5 rounded-full blur-lg transition-all duration-700 delay-100 ${
            index === currentSlide ? (isTransitioning ? 'scale-125 opacity-40' : 'scale-100 opacity-100') : 'scale-75 opacity-0'
          }`}></div>
          <div className={`absolute top-1/3 left-1/4 w-3 h-3 bg-white/20 rounded-full transition-all duration-500 ${
            index === currentSlide ? 'animate-pulse scale-100' : 'scale-0'
          }`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full transition-all duration-500 delay-200 ${
            index === currentSlide ? 'animate-pulse scale-100' : 'scale-0'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default VideoAdSlide;
