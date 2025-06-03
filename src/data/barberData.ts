
export interface Barber {
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
  ethnicity: string;
  age: number;
  languages: string[];
  personalityTraits: string[];
  videoUrl?: string;
}

export const nearbyBarbers: Barber[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    rating: 4.9,
    specialty: 'Fades & Braids',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    price: '$35',
    distance: '0.1 mi',
    experience: '8 years',
    lat: 29.771500,
    lng: -95.383500,
    ethnicity: 'African American',
    age: 32,
    languages: ['English', 'Spanish'],
    personalityTraits: ['Friendly', 'Creative', 'Experienced'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    name: 'Carlos Rivera',
    rating: 4.8,
    specialty: 'Classic Cuts',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    price: '$30',
    distance: '0.2 mi',
    experience: '12 years',
    lat: 29.772000,
    lng: -95.382000,
    ethnicity: 'Latino/Hispanic',
    age: 45,
    languages: ['Spanish', 'English'],
    personalityTraits: ['Professional', 'Traditional', 'Experienced'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    rating: 4.7,
    specialty: 'Beard Styling',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    price: '$40',
    distance: '0.3 mi',
    experience: '6 years',
    lat: 29.769500,
    lng: -95.384000,
    ethnicity: 'Middle Eastern',
    age: 28,
    languages: ['Arabic', 'English', 'French'],
    personalityTraits: ['Creative', 'Young & Trendy', 'Professional']
  },
  {
    id: '4',
    name: 'David Kim',
    rating: 4.6,
    specialty: 'Modern Styles',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    price: '$45',
    distance: '0.4 mi',
    experience: '5 years',
    lat: 29.770000,
    lng: -95.381500,
    ethnicity: 'Asian',
    age: 26,
    languages: ['English', 'Mandarin'],
    personalityTraits: ['Young & Trendy', 'Creative', 'Friendly']
  },
  {
    id: '5',
    name: 'Michael Thompson',
    rating: 4.5,
    specialty: 'Traditional Cuts',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    price: '$25',
    distance: '0.5 mi',
    experience: '15 years',
    lat: 29.771000,
    lng: -95.384500,
    ethnicity: 'Caucasian',
    age: 52,
    languages: ['English'],
    personalityTraits: ['Traditional', 'Professional', 'Experienced']
  }
];
