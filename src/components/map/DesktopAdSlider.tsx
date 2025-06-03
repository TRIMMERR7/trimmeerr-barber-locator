
import React from 'react';
import { companyAds } from './AdData';
import { useAdSlider } from './hooks/useAdSlider';
import VideoAdSlide from './components/VideoAdSlide';
import AdSlideControls from './components/AdSlideControls';

const DesktopAdSlider = () => {
  const {
    currentSlide,
    isPaused,
    setIsPaused,
    isHovering,
    setIsHovering,
    isMuted,
    isTransitioning,
    videoRefs,
    handlePrev,
    handleNext,
    handleSlideSelect,
    toggleMute
  } = useAdSlider();

  const handleAdClick = (website: string) => {
    window.open(`https://${website}`, '_blank');
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div 
      className="h-full flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Ad Display Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="relative h-full">
          {companyAds.map((ad, index) => (
            <VideoAdSlide
              key={ad.id}
              ad={ad}
              index={index}
              currentSlide={currentSlide}
              isTransitioning={isTransitioning}
              videoRef={el => videoRefs.current[index] = el}
              isMuted={isMuted}
              onAdClick={handleAdClick}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <AdSlideControls
        currentSlide={currentSlide}
        isPaused={isPaused}
        isMuted={isMuted}
        isTransitioning={isTransitioning}
        onPrev={handlePrev}
        onNext={handleNext}
        onSlideSelect={handleSlideSelect}
        onTogglePause={handleTogglePause}
        onToggleMute={toggleMute}
      />
    </div>
  );
};

export default DesktopAdSlider;
