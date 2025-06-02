
import { createMarkerStyles } from './markerStyles';
import { 
  createMarkerContainer, 
  createPulseRings, 
  createPinTail, 
  createMarkerBody, 
  createTooltip 
} from './markerElements';

export const createCustomBarberMarker = (barber: any): HTMLDivElement => {
  // Ensure styles are loaded
  createMarkerStyles();
  
  const markerElement = createMarkerContainer();
  
  markerElement.innerHTML = `
    <div class="marker-container" style="
      position: relative;
      width: 100%;
      height: 100%;
    ">
      ${createPulseRings()}
      ${createPinTail()}
      ${createMarkerBody(barber)}
      ${createTooltip(barber)}
    </div>
  `;
  
  return markerElement;
};
