
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdItem } from './AdData';

interface AdDisplayProps {
  ad: AdItem;
  onAdClick: (website: string) => void;
}

const AdDisplay = ({ ad, onAdClick }: AdDisplayProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`relative ${isMobile ? 'h-40' : 'h-44'} overflow-hidden group/ad`}>
      <div 
        className={`h-full bg-gradient-to-r ${ad.color} backdrop-blur-sm flex items-center justify-between p-4 md:p-6 relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]`}
        onClick={() => onAdClick(ad.website)}
      >
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
        
        {/* Image Section */}
        <div className="flex-shrink-0 z-10">
          <div className="relative">
            <img
              src={ad.image}
              alt={ad.company}
              className={`${
                isMobile ? 'w-20 h-20' : 'w-24 h-24'
              } rounded-2xl object-cover border-3 border-white/40 shadow-2xl transition-all duration-500 group-hover/ad:scale-110 group-hover/ad:rotate-3`}
            />
            <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm opacity-0 group-hover/ad:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default AdDisplay;
