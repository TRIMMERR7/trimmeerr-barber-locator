
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, Scissors, Zap, Flame, Star, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';
import AnimatedButton from './AnimatedButton';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
  selectedService: Service | null;
}

const ServiceSelection = ({ onServiceSelect, selectedService }: ServiceSelectionProps) => {
  const services: Service[] = [
    {
      id: 'classic-cut',
      name: 'Classic Haircut',
      price: 30,
      duration: '30 min',
      icon: Scissors,
      popular: false,
      description: 'Traditional haircut with scissor and clipper work'
    },
    {
      id: 'fade-cut',
      name: 'Fade Cut',
      price: 35,
      duration: '35 min',
      icon: Zap,
      popular: true,
      description: 'Modern fade with precise blending and styling'
    },
    {
      id: 'beard-trim',
      name: 'Beard Trim',
      price: 20,
      duration: '20 min',
      icon: Scissors,
      popular: false,
      description: 'Professional beard shaping and trimming'
    },
    {
      id: 'hot-towel-shave',
      name: 'Hot Towel Shave',
      price: 40,
      duration: '45 min',
      icon: Flame,
      popular: false,
      description: 'Traditional hot towel shave with premium products'
    },
    {
      id: 'premium-package',
      name: 'Premium Package',
      price: 60,
      duration: '60 min',
      icon: Star,
      popular: true,
      description: 'Haircut + beard trim + hot towel treatment'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Choose Your Perfect Service</h3>
        </div>
        
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            const isSelected = selectedService?.id === service.id;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer transition-all duration-300 rounded-xl border-2 overflow-hidden ${
                  isSelected 
                    ? 'border-red-600 bg-gradient-to-r from-red-50 to-red-100 shadow-lg' 
                    : service.popular 
                    ? 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50 hover:border-red-400 hover:shadow-md' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => onServiceSelect(service)}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                        isSelected ? 'bg-red-600' : service.popular ? 'bg-red-600' : 'bg-gray-400'
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                      {service.popular && !isSelected && (
                        <motion.div
                          className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Sparkles className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-lg">{service.name}</span>
                        {service.popular && (
                          <motion.span 
                            className="text-xs bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-1 rounded-full font-medium"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                          >
                            🔥 Popular
                          </motion.span>
                        )}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <Check className="w-5 h-5 text-red-600" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          ⏱️ {service.duration}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{service.description}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <motion.div
                      className={`text-2xl font-bold ${isSelected ? 'text-red-600' : 'text-gray-900'}`}
                      animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      ${service.price}
                    </motion.div>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="bg-red-600 text-white px-4 py-2 text-sm font-medium text-center"
                  >
                    ✨ Great choice! Let's pick your time slot
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
