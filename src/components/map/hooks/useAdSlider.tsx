
import { useState, useEffect, useRef } from 'react';
import { companyAds } from '../AdData';

export const useAdSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (isPaused || isHovering) return;
    
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % companyAds.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused, isHovering]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide && !isTransitioning) {
          video.currentTime = 0;
          video.play().catch(() => {
            // Handle autoplay restrictions
          });
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide, isTransitioning]);

  const handleSlideChange = (newSlideOrFunction: number | ((prev: number) => number)) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (typeof newSlideOrFunction === 'function') {
        setCurrentSlide(newSlideOrFunction);
      } else {
        setCurrentSlide(newSlideOrFunction);
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 200);
  };

  const handlePrev = () => {
    const newSlide = (currentSlide - 1 + companyAds.length) % companyAds.length;
    handleSlideChange(newSlide);
  };

  const handleNext = () => {
    const newSlide = (currentSlide + 1) % companyAds.length;
    handleSlideChange(newSlide);
  };

  const handleSlideSelect = (index: number) => {
    if (index !== currentSlide) {
      handleSlideChange(index);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach(video => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };

  return {
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
  };
};
