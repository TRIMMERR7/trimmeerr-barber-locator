
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "John D.",
      rating: 5,
      comment: "Amazing fade! Marcus really knows his craft. Will definitely be back.",
      date: "2 days ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Mike R.",
      rating: 5,
      comment: "Clean cut, professional service. Highly recommend!",
      date: "1 week ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "David L.",
      rating: 4,
      comment: "Great experience overall. The shop has a nice vibe too.",
      date: "2 weeks ago",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Reviews & Ratings</h3>
        
        {/* Overall rating summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">4.9</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/70">Based on 127 reviews</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">98% recommend</p>
            </div>
          </div>
        </div>

        {/* Individual reviews */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-white/20 last:border-b-0 pb-4 last:pb-0">
              <div className="flex gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white">{review.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? "text-yellow-500 fill-current"
                                  : "text-white/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-white/50">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-red-400 font-medium text-sm hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 backdrop-blur-sm">
          View All Reviews
        </button>
      </CardContent>
    </Card>
  );
};

export default Reviews;
