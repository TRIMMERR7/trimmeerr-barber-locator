
import React from 'react';
import { AdItem } from './AdData';

interface AdIndicatorsProps {
  ads: AdItem[];
  currentSlide: number;
  onSlideSelect: (index: number) => void;
}

const AdIndicators = ({ ads, currentSlide, onSlideSelect }: AdIndicatorsProps) => {
  return (
    <div className="flex gap-2">
      {ads.map((_, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            onSlideSelect(index);
          }}
          className={`h-2 rounded-full transition-all duration-500 hover:scale-125 ${
            index === currentSlide 
              ? 'bg-white w-8 shadow-lg' 
              : 'bg-white/50 hover:bg-white/70 w-2'
          }`}
        />
      ))}
    </div>
  );
};

export default AdIndicators;
