
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useBookingDialog } from '@/hooks/useBookingDialog';
import BookingDialogHeader from './BookingDialogHeader';
import BookingDialogContent from './BookingDialogContent';
import type { Service, Barber } from '@/types/booking';

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
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] shadow-2xl border-0 p-0">
        <div className="flex flex-col h-full overflow-hidden">
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
            barberId={barber.id}
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
  );
};

export default BookingDialog;
