
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Work</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative group cursor-pointer">
              <img
                src={`https://images.unsplash.com/photo-${1621605815971 + i}?w=200&h=200&fit=crop`}
                alt={`Work ${i}`}
                className="w-full h-20 sm:h-24 object-cover rounded-xl group-hover:scale-105 transition-transform shadow-md"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Portfolio;
