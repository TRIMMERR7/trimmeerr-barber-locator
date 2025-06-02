
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface BarberProfileProps {
  barber: Barber;
  onBack: () => void;
  userType: 'barber' | 'client' | 'guest';
}

const BarberProfile = ({ barber, onBack, userType }: BarberProfileProps) => {
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Mock data - in real app would come from API
  const reviews = [
    {
      id: '1',
      author: 'Mike Chen',
      rating: 5,
      comment: 'Amazing fade! Marcus really knows his craft. Will definitely be back.',
      date: '2 days ago',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      author: 'David Rodriguez',
      rating: 5,
      comment: 'Best barber in the area. Professional, clean, and great conversation.',
      date: '1 week ago',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const portfolio = [
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1503951458645-643d911bc19c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop'
  ];

  const availableTimes = ['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'];

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    
    if (userType === 'guest') {
      alert('Please sign in to book an appointment');
      return;
    }
    
    // Simulate booking success
    alert(`Appointment booked with ${barber.name} at ${selectedTime}!\n\nA confirmation will be sent to your email.`);
  };

  return (
    <div className="min-h-screen bg-trimmer-dark">
      {/* Header */}
      <div className="bg-trimmer-slate border-b border-slate-700 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            ← Back to Map
          </Button>
          <h1 className="text-xl font-semibold text-white">Barber Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-trimmer-red"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-trimmer-dark flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-white">{barber.name}</h2>
                  <p className="text-trimmer-blue text-lg font-medium">{barber.specialty}</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="text-white font-semibold">{barber.rating}</span>
                    <span className="text-slate-400">(127 reviews)</span>
                  </div>
                  <Badge variant="outline" className="border-trimmer-blue text-trimmer-blue">
                    {barber.experience} experience
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    Available Today
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-400">Distance: <span className="text-white">{barber.distance}</span></span>
                  <span className="text-slate-400">Price Range: <span className="text-trimmer-blue font-semibold">{barber.price}</span></span>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-trimmer-red hover:bg-red-600 text-white">
                    📞 Call Now
                  </Button>
                  <Button variant="outline" className="border-trimmer-blue text-trimmer-blue hover:bg-trimmer-blue hover:text-white">
                    💬 Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {portfolio.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Work ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Available Times Today
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time 
                        ? "bg-trimmer-blue hover:bg-blue-600" 
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Service Fee</span>
                  <span className="text-white">$35</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">App Fee (3.5%)</span>
                  <span className="text-white">$1.23</span>
                </div>
                <Separator className="bg-slate-600" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-trimmer-blue">$36.23</span>
                </div>
              </div>
              
              <Button 
                onClick={handleBooking}
                className="w-full bg-trimmer-red hover:bg-red-600 text-white font-semibold"
                disabled={!selectedTime}
              >
                {userType === 'guest' ? 'Sign In to Book' : 'Book Appointment'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{review.author}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={i < review.rating ? 'text-yellow-400' : 'text-slate-600'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{review.comment}</p>
                  </div>
                </div>
                {review.id !== reviews[reviews.length - 1].id && (
                  <Separator className="bg-slate-700" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarberProfile;
