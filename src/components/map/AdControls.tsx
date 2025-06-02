
import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import AdIndicators from './AdIndicators';
import { AdItem } from './AdData';

interface AdControlsProps {
  ads: AdItem[];
  currentSlide: number;
  isPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSlideSelect: (index: number) => void;
  onTogglePause: () => void;
}

const AdControls = ({ 
  ads, 
  currentSlide, 
  isPaused, 
  onPrev, 
  onNext, 
  onSlideSelect, 
  onTogglePause 
}: AdControlsProps) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border-t border-white/10">
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        
        <AdIndicators 
          ads={ads}
          currentSlide={currentSlide}
          onSlideSelect={onSlideSelect}
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePause();
          }}
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          {isPaused ? (
            <Play className="w-3 h-3 text-white ml-0.5" />
          ) : (
            <Pause className="w-3 h-3 text-white" />
          )}
        </button>
        <div className="text-white/80 text-sm font-medium">
          {currentSlide + 1} / {ads.length}
        </div>
      </div>
    </div>
  );
};

export default AdControls;
