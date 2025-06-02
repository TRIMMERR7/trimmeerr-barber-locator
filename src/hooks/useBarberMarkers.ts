
import { useRef, useEffect } from 'react';

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
}

interface UseBarberMarkersProps {
  map: React.MutableRefObject<any>;
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

export const useBarberMarkers = ({ map, nearbyBarbers, onBarberSelect }: UseBarberMarkersProps) => {
  const barberAnnotations = useRef<any[]>([]);

  useEffect(() => {
    console.log('useBarberMarkers: Effect triggered');
    console.log('useBarberMarkers: map.current exists?', !!map.current);
    console.log('useBarberMarkers: nearbyBarbers length:', nearbyBarbers.length);

    if (!map.current) {
      console.log('useBarberMarkers: No map available, exiting');
      return;
    }

    if (!nearbyBarbers.length) {
      console.log('useBarberMarkers: No barbers available, exiting');
      return;
    }

    console.log('useBarberMarkers: Adding barber markers...', nearbyBarbers.length, 'barbers');

    // Clear existing markers
    if (barberAnnotations.current.length > 0) {
      try {
        console.log('useBarberMarkers: Removing', barberAnnotations.current.length, 'existing markers');
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      console.log('useBarberMarkers: Creating marker for barber:', barber.name, 'at', barber.lat, barber.lng);

      // Create a custom HTML element for the marker
      const markerElement = document.createElement('div');
      markerElement.className = 'barber-marker-container';
      markerElement.innerHTML = `
        <div class="barber-marker-wrapper">
          <div class="barber-marker-pin">
            <img src="${barber.image}" alt="${barber.name}" class="barber-avatar" />
            <div class="barber-price-badge">${barber.price}</div>
          </div>
          <div class="barber-marker-pulse"></div>
        </div>
      `;

      // Add styles for the custom marker
      const style = document.createElement('style');
      style.textContent = `
        .barber-marker-container {
          position: relative;
          width: 70px;
          height: 70px;
          z-index: 1000;
          cursor: pointer;
          animation: markerBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .barber-marker-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .barber-marker-pin {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
          border: 4px solid white;
          box-shadow: 
            0 8px 25px rgba(220, 38, 38, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          z-index: 1001;
          transform: translateZ(0);
        }
        
        .barber-marker-pin::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .barber-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.4s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .barber-price-badge {
          position: absolute;
          bottom: -8px;
          right: -8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 3px 6px;
          border-radius: 12px;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          z-index: 1002;
          animation: priceBadgeFloat 3s ease-in-out infinite;
        }
        
        .barber-marker-pulse {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%);
          animation: enhancedPulse 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 999;
        }
        
        .barber-marker-pin:hover {
          transform: scale(1.2) translateY(-4px);
          box-shadow: 
            0 12px 35px rgba(220, 38, 38, 0.6),
            0 6px 18px rgba(0, 0, 0, 0.4),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
          border-color: #fbbf24;
        }
        
        .barber-marker-pin:hover .barber-avatar {
          transform: scale(1.08);
        }
        
        .barber-marker-pin:hover .barber-price-badge {
          transform: scale(1.1);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.6);
        }
        
        .barber-marker-pin:active {
          transform: scale(1.1) translateY(-2px);
          transition: all 0.15s ease;
        }
        
        @keyframes markerBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-80px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(-15px);
          }
          70% {
            transform: scale(0.95) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px);
          }
        }
        
        @keyframes enhancedPulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.4;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        
        @keyframes priceBadgeFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `;
      
      if (!document.head.querySelector('#barber-marker-styles')) {
        style.id = 'barber-marker-styles';
        document.head.appendChild(style);
      }

      // Create marker annotation with custom HTML
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#EF4444',
          glyphColor: '#FFFFFF',
          title: barber.name,
          subtitle: `${barber.specialty} • ${barber.price}`,
          data: { barber },
          element: markerElement
        }
      );

      // Add click event to the custom element
      markerElement.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('useBarberMarkers: Barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      // Add selection event listener
      annotation.addEventListener('select', (event) => {
        console.log('useBarberMarkers: Barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      // Add deselect event for debugging
      annotation.addEventListener('deselect', () => {
        console.log('useBarberMarkers: Barber marker deselected:', barber.name);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    console.log('useBarberMarkers: Created', annotations.length, 'annotations');
    
    try {
      map.current.addAnnotations(annotations);
      console.log('useBarberMarkers: All barber markers added successfully to map');
      
      // Set initial region to show the barbers
      if (annotations.length > 0) {
        const coordinates = nearbyBarbers.map(barber => 
          new window.mapkit.Coordinate(barber.lat, barber.lng)
        );
        
        // Create a region that includes all barber locations
        const region = window.mapkit.CoordinateRegion.regionFittingCoordinates(coordinates);
        map.current.setRegionAnimated(region, true);
      }
    } catch (error) {
      console.error('useBarberMarkers: Error adding annotations to map:', error);
    }

    return () => {
      if (map.current && barberAnnotations.current.length > 0) {
        try {
          console.log('useBarberMarkers: Cleanup - removing', barberAnnotations.current.length, 'markers');
          map.current.removeAnnotations(barberAnnotations.current);
        } catch (error) {
          console.warn('Error removing barber annotations during cleanup:', error);
        } finally {
          barberAnnotations.current = [];
        }
      }
    };
  }, [map, nearbyBarbers, onBarberSelect]);

  return { barberAnnotations };
};
