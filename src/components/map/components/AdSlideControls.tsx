
import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { companyAds } from '../AdData';
import SlideIndicators from './SlideIndicators';

interface AdSlideControlsProps {
  currentSlide: number;
  isPaused: boolean;
  isMuted: boolean;
  isTransitioning: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSlideSelect: (index: number) => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

const AdSlideControls = ({
  currentSlide,
  isPaused,
  isMuted,
  isTransitioning,
  onPrev,
  onNext,
  onSlideSelect,
  onTogglePause,
  onToggleMute
}: AdSlideControlsProps) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border-t border-white/10">
      {/* Left Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          disabled={isTransitioning}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <SlideIndicators
          currentSlide={currentSlide}
          isTransitioning={isTransitioning}
          onSlideSelect={onSlideSelect}
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={isTransitioning}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePause();
          }}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
        >
          {isPaused ? (
            <Play className="w-4 h-4 text-white ml-0.5" />
          ) : (
            <Pause className="w-4 h-4 text-white" />
          )}
        </button>
        
        <div className="text-white/80 text-sm font-medium">
          {currentSlide + 1} / {companyAds.length}
        </div>
      </div>
    </div>
  );
};

export default AdSlideControls;
