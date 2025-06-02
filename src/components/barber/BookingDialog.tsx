import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useBookingDialog } from '@/hooks/useBookingDialog';
import BookingDialogHeader from './BookingDialogHeader';
import BookingDialogContent from './BookingDialogContent';
import AIBookingAssistant from '../AIBookingAssistant';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

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

interface BookingDialogProps {
  barber: Barber;
  children: React.ReactNode;
}

const BookingDialog = ({ barber, children }: BookingDialogProps) => {
  const {
    selectedService,
    selectedTime,
    userPhone,
    isOpen,
    isProcessingPayment,
    step,
    paymentUrl,
    paymentLoading,
    user,
    handleServiceSelect,
    handleTimeSelect,
    setUserPhone,
    handleBookingAndPayment,
    handleStepBack,
    handlePaymentComplete,
    handlePaymentLoad,
    getStepTitle,
    handleDialogOpenChange
  } = useBookingDialog(barber);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className={`${step === 'payment' ? 'sm:max-w-6xl max-w-[98vw] h-[95vh]' : 'sm:max-w-lg max-w-[95vw]'} shadow-2xl border-0 p-0`}>
          <div className="flex flex-col h-full">
            <BookingDialogHeader
              step={step}
              barberName={barber.name}
              stepTitle={getStepTitle()}
              onStepBack={handleStepBack}
            />
            
            <BookingDialogContent
              step={step}
              selectedService={selectedService}
              selectedTime={selectedTime}
              userPhone={userPhone}
              user={user}
              isProcessingPayment={isProcessingPayment}
              paymentUrl={paymentUrl}
              paymentLoading={paymentLoading}
              onServiceSelect={handleServiceSelect}
              onTimeSelect={handleTimeSelect}
              setUserPhone={setUserPhone}
              onBookingAndPayment={handleBookingAndPayment}
              onPaymentLoad={handlePaymentLoad}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant for booking steps */}
      {isOpen && (
        <AIBookingAssistant
          currentStep="book"
          selectedBarber={barber}
        />
      )}
    </>
  );
};

export default BookingDialog;
