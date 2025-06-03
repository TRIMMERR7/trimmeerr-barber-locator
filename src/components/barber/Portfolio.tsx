
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  const portfolioImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=400&fit=crop&crop=center",
      title: "Fresh Fade"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop&crop=center",
      title: "Classic Cut"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&crop=center",
      title: "Beard Trim"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop&crop=center",
      title: "Style & Finish"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&crop=center",
      title: "Hot Towel Service"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop&crop=center",
      title: "Final Touch"
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <CardContent className="p-3 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-semibold text-white">Recent Work</h3>
          <span className="text-xs md:text-sm text-white/60">Portfolio</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {portfolioImages.map((image) => (
            <div key={image.id} className="relative group cursor-pointer">
              <div className="aspect-square w-full overflow-hidden rounded-lg md:rounded-xl border border-white/20 backdrop-blur-sm">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 shadow-md"
                  loading="lazy"
                  onLoad={() => {
                    console.log(`Image loaded successfully: ${image.title}`);
                  }}
                  onError={(e) => {
                    console.log(`Failed to load image: ${image.url}`);
                    e.currentTarget.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop`;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg md:rounded-xl transition-colors flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center px-2">
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-3 md:mt-4 py-2 text-red-400 font-medium text-sm hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 backdrop-blur-sm">
          View Full Portfolio
        </button>
      </CardContent>
    </Card>
  );
};

export default Portfolio;
