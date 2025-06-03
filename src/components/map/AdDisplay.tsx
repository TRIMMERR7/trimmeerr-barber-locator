
import React, { useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdItem } from './AdData';

interface AdDisplayProps {
  ad: AdItem;
  onAdClick: (website: string) => void;
  isActive?: boolean;
}

const AdDisplay = ({ ad, onAdClick, isActive = true }: AdDisplayProps) => {
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <div className={`relative ${isMobile ? 'h-40' : 'h-44'} overflow-hidden group/ad`}>
      <div 
        className="relative h-full overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
        onClick={() => onAdClick(ad.website)}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          src={ad.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
        />
        
        {/* Overlay with gradient and content */}
        <div className={`absolute inset-0 bg-gradient-to-r ${ad.color} backdrop-blur-sm flex items-center justify-between p-4 md:p-6 relative overflow-hidden`}>
          {/* Content Section */}
          <div className="flex-1 pr-4 min-w-0 z-10">
            <div className={`text-white/90 ${
              isMobile ? 'text-sm' : 'text-base'
            } font-semibold mb-2 tracking-wide`}>
              {ad.tagline}
            </div>
            <h3 className={`text-white font-bold ${
              isMobile ? 'text-xl' : 'text-2xl'
            } leading-tight mb-3 drop-shadow-lg`}>
              {ad.company}
            </h3>
            <div className="flex flex-col gap-2">
              <div className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm inline-block shadow-lg">
                {ad.offer}
              </div>
              <button className="flex items-center gap-2 text-white font-semibold text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 w-fit">
                {ad.ctaText}
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default AdDisplay;
