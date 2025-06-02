
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  const portfolioImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop",
      title: "Fresh Fade"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1621605815972-fbc98d665033?w=300&h=300&fit=crop",
      title: "Classic Cut"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1621605815973-fbc98d665033?w=300&h=300&fit=crop",
      title: "Beard Trim"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1621605815974-fbc98d665033?w=300&h=300&fit=crop",
      title: "Style & Finish"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1621605815975-fbc98d665033?w=300&h=300&fit=crop",
      title: "Hot Towel Service"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1621605815976-fbc98d665033?w=300&h=300&fit=crop",
      title: "Final Touch"
    }
  ];

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Work</h3>
          <span className="text-sm text-gray-500">Portfolio</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {portfolioImages.map((image) => (
            <div key={image.id} className="relative group cursor-pointer">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-24 md:h-28 object-cover rounded-xl group-hover:scale-105 transition-transform shadow-md"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-colors flex items-center justify-center">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-red-600 font-medium text-sm hover:bg-red-50 rounded-lg transition-colors">
          View Full Portfolio
        </button>
      </CardContent>
    </Card>
  );
};

export default Portfolio;
