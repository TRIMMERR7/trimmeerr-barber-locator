
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star, Crown } from 'lucide-react';

interface BarbersOfTheYearPageProps {
  onBack: () => void;
}

const BarbersOfTheYearPage = ({ onBack }: BarbersOfTheYearPageProps) => {
  const topBarbers = [
    {
      name: "Marcus Thompson",
      shop: "Elite Cuts Studio",
      rating: 4.9,
      awards: ["Best Fade 2024", "Customer's Choice"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      specialty: "Precision Fades & Modern Cuts"
    },
    {
      name: "David Rodriguez",
      shop: "Premium Barbershop",
      rating: 4.8,
      awards: ["Innovation Award 2024", "Rising Star"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      specialty: "Classic Styles & Beard Design"
    },
    {
      name: "James Wilson",
      shop: "The Gentleman's Cut",
      rating: 4.9,
      awards: ["Master Barber 2024", "Excellence Award"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      specialty: "Traditional Cuts & Hot Towel Shaves"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="glass-morphism-dark min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:text-red-300 hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Barbers of the Year 2024
            </h1>
          </div>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Crown className="w-16 h-16 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Celebrating excellence in barbering. These masters of their craft have been recognized 
              for their exceptional skills, customer service, and innovation in the industry.
            </p>
          </div>

          {/* Top Barbers */}
          <div className="space-y-6">
            {topBarbers.map((barber, index) => (
              <div
                key={barber.name}
                className="glass-morphism-card rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start space-x-6">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={barber.image}
                        alt={barber.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500"
                      />
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Barber Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{barber.name}</h3>
                      <p className="text-yellow-400 font-medium">{barber.shop}</p>
                      <p className="text-gray-400 text-sm">{barber.specialty}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(barber.rating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-medium">{barber.rating}</span>
                    </div>

                    {/* Awards */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 font-medium">Awards & Recognition:</p>
                      <div className="flex flex-wrap gap-2">
                        {barber.awards.map((award) => (
                          <span
                            key={award}
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium border border-yellow-500/30"
                          >
                            🏆 {award}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4 mt-12">
            <h3 className="text-xl font-bold text-white">
              Want to book with one of our award-winning barbers?
            </h3>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Browse All Barbers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbersOfTheYearPage;
