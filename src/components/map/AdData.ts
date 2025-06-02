
export interface AdItem {
  id: number;
  company: string;
  tagline: string;
  offer: string;
  image: string;
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
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=120&h=120&fit=crop",
    color: "from-blue-500/90 via-blue-600/90 to-blue-700/90",
    ctaText: "Shop Now",
    website: "barbertools.com"
  },
  {
    id: 2,
    company: "StyleCare Products",
    tagline: "Premium Hair Care",
    offer: "Buy 2 Get 1 FREE",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop",
    color: "from-emerald-500/90 via-emerald-600/90 to-emerald-700/90",
    ctaText: "Get Deal",
    website: "stylecare.com"
  },
  {
    id: 3,
    company: "BarberAcademy",
    tagline: "Learn & Grow",
    offer: "30% Discount - Enroll Now",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop",
    color: "from-purple-500/90 via-purple-600/90 to-purple-700/90",
    ctaText: "Enroll",
    website: "barberacademy.com"
  },
  {
    id: 4,
    company: "TrimTech Solutions",
    tagline: "Smart Booking System",
    offer: "Free 30-Day Trial",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop",
    color: "from-orange-500/90 via-orange-600/90 to-orange-700/90",
    ctaText: "Try Free",
    website: "trimtech.com"
  }
];
