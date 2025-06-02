
export const createMarkerStyles = (): void => {
  // Check if styles are already added to avoid duplicates
  if (document.head.querySelector('#barber-marker-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'barber-marker-styles';
  style.textContent = `
    @keyframes pulse-ring {
      0% {
        transform: translateX(-50%) scale(0.8);
        opacity: 1;
      }
      100% {
        transform: translateX(-50%) scale(1.4);
        opacity: 0;
      }
    }

    @keyframes marker-bounce {
      0% {
        transform: translateX(-50%) scale(0) translateY(20px);
        opacity: 0;
      }
      50% {
        transform: translateX(-50%) scale(1.1) translateY(-5px);
      }
      100% {
        transform: translateX(-50%) scale(1) translateY(0);
        opacity: 1;
      }
    }

    .marker-container:hover .tooltip {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }

    .custom-barber-marker:hover {
      transform: translateX(-50%) translateY(-100%) scale(1.1);
    }
  `;
  
  document.head.appendChild(style);
};
