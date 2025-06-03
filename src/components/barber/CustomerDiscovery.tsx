
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, MessageCircle, Star, Filter } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  avatar: string;
  location: string;
  distance: string;
  lastActive: string;
  preferredServices: string[];
  rating: number;
  totalBookings: number;
  preferredTime: string;
  budget: string;
  bio: string;
}

interface CustomerDiscoveryProps {
  onMessageCustomer: (customerId: string) => void;
}

const CustomerDiscovery = ({ onMessageCustomer }: CustomerDiscoveryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'nearby' | 'recent' | 'frequent'>('all');

  // Mock customer data - in real app this would come from API
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Downtown',
      distance: '0.5 miles',
      lastActive: '2 hours ago',
      preferredServices: ['Haircut', 'Beard Trim'],
      rating: 4.8,
      totalBookings: 12,
      preferredTime: 'Weekends',
      budget: '$30-50',
      bio: 'Looking for a consistent barber for regular cuts'
    },
    {
      id: '2',
      name: 'Marcus Davis',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      location: 'Midtown',
      distance: '1.2 miles',
      lastActive: '1 day ago',
      preferredServices: ['Fade', 'Styling'],
      rating: 4.9,
      totalBookings: 8,
      preferredTime: 'Evenings',
      budget: '$40-60',
      bio: 'Professional looking for premium styling services'
    },
    {
      id: '3',
      name: 'Jordan Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Uptown',
      distance: '2.1 miles',
      lastActive: '3 hours ago',
      preferredServices: ['Haircut', 'Hot Towel Shave'],
      rating: 4.7,
      totalBookings: 15,
      preferredTime: 'Mornings',
      budget: '$35-55',
      bio: 'Enjoys traditional barbering experience'
    }
  ]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.preferredServices.some(service => 
                           service.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    if (selectedFilter === 'nearby') {
      return matchesSearch && parseFloat(customer.distance) <= 1.0;
    }
    if (selectedFilter === 'recent') {
      return matchesSearch && customer.lastActive.includes('hour');
    }
    if (selectedFilter === 'frequent') {
      return matchesSearch && customer.totalBookings >= 10;
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Discover Customers</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers or services..."
              className="bg-gray-800 border-gray-600 text-white pl-10 w-64"
            />
          </div>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Customers' },
          { key: 'nearby', label: 'Nearby' },
          { key: 'recent', label: 'Recently Active' },
          { key: 'frequent', label: 'Frequent Clients' }
        ].map(filter => (
          <Button
            key={filter.key}
            variant={selectedFilter === filter.key ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter.key as any)}
            className={selectedFilter === filter.key ? 
              "bg-red-600 hover:bg-red-700" : 
              "border-gray-600 text-gray-300 hover:bg-gray-700"
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="bg-gray-900 border-gray-700 hover:border-red-500 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-red-600 text-white">
                    {customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{customer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{customer.location} • {customer.distance}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Active {customer.lastActive}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4">{customer.bio}</p>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Preferred Services</div>
                  <div className="flex flex-wrap gap-1">
                    {customer.preferredServices.map(service => (
                      <Badge key={service} variant="outline" className="border-red-500 text-red-400 text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Rating</div>
                    <div className="flex items-center gap-1 text-white">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{customer.rating}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Bookings</div>
                    <div className="text-white">{customer.totalBookings}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Preferred Time</div>
                    <div className="text-white">{customer.preferredTime}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Budget</div>
                    <div className="text-white">{customer.budget}</div>
                  </div>
                </div>

                <Button 
                  onClick={() => onMessageCustomer(customer.id)}
                  className="w-full bg-red-600 hover:bg-red-700 mt-4"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No customers found</div>
          <div className="text-gray-500">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
};

export default CustomerDiscovery;
