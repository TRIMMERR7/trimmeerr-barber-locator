
export interface AdItem {
  id: number;
  company: string;
  tagline: string;
  offer: string;
  videoUrl: string;
  color: string;
  ctaText: string;
  website: string;
}

export const companyAds: AdItem[] = [
  {
    id: 1,
    company: "BarberTools Pro",
    tagline: "Professional Equipment",
    offer: "20% OFF Premium Clippers",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    color: "from-blue-500/90 via-blue-600/90 to-blue-700/90",
    ctaText: "Shop Now",
    website: "barbertools.com"
  },
  {
    id: 2,
    company: "StyleCare Products",
    tagline: "Premium Hair Care",
    offer: "Buy 2 Get 1 FREE",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    color: "from-emerald-500/90 via-emerald-600/90 to-emerald-700/90",
    ctaText: "Get Deal",
    website: "stylecare.com"
  },
  {
    id: 3,
    company: "BarberAcademy",
    tagline: "Learn & Grow",
    offer: "30% Discount - Enroll Now",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    color: "from-purple-500/90 via-purple-600/90 to-purple-700/90",
    ctaText: "Enroll",
    website: "barberacademy.com"
  },
  {
    id: 4,
    company: "TrimTech Solutions",
    tagline: "Smart Booking System",
    offer: "Free 30-Day Trial",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    color: "from-orange-500/90 via-orange-600/90 to-orange-700/90",
    ctaText: "Try Free",
    website: "trimtech.com"
  }
];
