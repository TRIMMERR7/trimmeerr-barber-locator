
import React from 'react';
import { companyAds } from '../AdData';

interface SlideIndicatorsProps {
  currentSlide: number;
  isTransitioning: boolean;
  onSlideSelect: (index: number) => void;
}

const SlideIndicators = ({ currentSlide, isTransitioning, onSlideSelect }: SlideIndicatorsProps) => {
  return (
    <div className="flex gap-2">
      {companyAds.map((_, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            onSlideSelect(index);
          }}
          disabled={isTransitioning}
          className={`h-2 rounded-full transition-all duration-500 hover:scale-125 disabled:cursor-not-allowed ${
            index === currentSlide 
              ? 'bg-white w-8 shadow-lg' 
              : 'bg-white/50 hover:bg-white/70 w-2'
          }`}
        />
      ))}
    </div>
  );
};

export default SlideIndicators;
