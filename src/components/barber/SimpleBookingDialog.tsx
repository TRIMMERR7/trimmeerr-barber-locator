
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Phone, CreditCard, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useSimpleBooking } from '@/hooks/useSimpleBooking';
import type { Barber } from '@/types/booking';

interface SimpleBookingDialogProps {
  barber: Barber;
  children: React.ReactNode;
}

const SimpleBookingDialog = ({ barber, children }: SimpleBookingDialogProps) => {
  const {
    isOpen,
    selectedService,
    selectedTime,
    userPhone,
    isProcessing,
    services,
    availableTimes,
    user,
    setSelectedService,
    setSelectedTime,
    setUserPhone,
    handleBooking,
    handleDialogChange
  } = useSimpleBooking(barber);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return phoneNumber;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setUserPhone(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-black/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="flex items-center gap-2 text-white text-xl">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Clock className="w-6 h-6 text-red-400" />
            </motion.div>
            Book with {barber.name}
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </DialogTitle>
        </DialogHeader>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Service Selection */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              Choose Service
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedService?.id === service.id 
                          ? 'ring-2 ring-red-400 bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm border-red-400/50 shadow-lg shadow-red-500/25' 
                          : 'hover:shadow-lg bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white">{service.name}</h3>
                              {selectedService?.id === service.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                >
                                  <CheckCircle className="w-4 h-4 text-red-400" />
                                </motion.div>
                              )}
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{service.description}</p>
                            <p className="text-sm text-gray-400">{service.duration} minutes</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-red-400">${service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Time Selection */}
          <AnimatePresence>
            {selectedService && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-base font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Select Time
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time, index) => (
                    <motion.div
                      key={time}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time 
                          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg" 
                          : "bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                        }
                      >
                        {time}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Info */}
          <AnimatePresence>
            {selectedService && selectedTime && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <h3 className="font-medium mb-2 text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Booking Summary
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300"><span className="font-medium text-white">Service:</span> {selectedService.name}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Time:</span> {selectedTime}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Duration:</span> {selectedService.duration} minutes</p>
                    <p className="text-gray-300"><span className="font-medium text-red-400">Price:</span> ${selectedService.price}</p>
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-white">
                    <Phone className="w-4 h-4 text-blue-400" />
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={userPhone}
                    onChange={handlePhoneChange}
                    maxLength={14}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400/30"
                  />
                  <p className="text-xs text-gray-400">
                    We'll send appointment confirmations to this number
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    onClick={handleBooking}
                    disabled={!user || isProcessing}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 border-0 shadow-lg relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating checkout...
                      </div>
                    ) : !user ? (
                      'Sign In to Book'
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Book & Pay ${selectedService.price}
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        ease: "linear",
                        repeatDelay: 2 
                      }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleBookingDialog;
