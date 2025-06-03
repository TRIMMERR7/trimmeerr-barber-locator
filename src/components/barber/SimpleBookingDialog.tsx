
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Phone, CreditCard, Loader2, CheckCircle } from "lucide-react";
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
      
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Book with {barber.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Choose Service</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    selectedService?.id === service.id 
                      ? 'ring-2 ring-red-500 bg-red-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{service.name}</h3>
                          {service.popular && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                          {selectedService?.id === service.id && (
                            <CheckCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <p className="text-sm text-gray-500">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">${service.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedService && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Time</Label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className={selectedTime === time ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          {selectedService && selectedTime && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Service:</span> {selectedService.name}</p>
                  <p><span className="font-medium">Time:</span> {selectedTime}</p>
                  <p><span className="font-medium">Duration:</span> {selectedService.duration}</p>
                  <p><span className="font-medium">Price:</span> ${selectedService.price}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={userPhone}
                  onChange={handlePhoneChange}
                  maxLength={14}
                />
                <p className="text-xs text-gray-500">
                  We'll send appointment confirmations to this number
                </p>
              </div>

              <Button 
                onClick={handleBooking}
                disabled={!user || isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 h-12"
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
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleBookingDialog;
