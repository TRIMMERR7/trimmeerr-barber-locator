
import { Barber } from '@/types/barber';

export const openInAppleMaps = (barber: Barber) => {
  const appleMapsUrl = `https://maps.apple.com/?daddr=${barber.lat},${barber.lng}&dirflg=d&t=m`;
  window.open(appleMapsUrl, '_blank');
};
