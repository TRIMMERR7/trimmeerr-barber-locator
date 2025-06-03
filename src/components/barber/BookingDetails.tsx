
import React from 'react';
import { motion } from 'framer-motion';
import UserInfoCard from './booking/UserInfoCard';
import PhoneNumberInput from './booking/PhoneNumberInput';
import BookingSummaryCard from './booking/BookingSummaryCard';
import SecureCheckoutButton from './booking/SecureCheckoutButton';
import SecurityNotice from './booking/SecurityNotice';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingDetailsProps {
  selectedService: Service | null;
  selectedTime: string;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  onBookingAndPayment: () => void;
  isProcessingPayment: boolean;
  user: any;
}

const BookingDetails = ({ 
  selectedService, 
  selectedTime, 
  userPhone, 
  setUserPhone, 
  onBookingAndPayment, 
  isProcessingPayment, 
  user 
}: BookingDetailsProps) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <UserInfoCard user={user} />
      
      <PhoneNumberInput 
        userPhone={userPhone} 
        setUserPhone={setUserPhone} 
      />

      <BookingSummaryCard 
        selectedService={selectedService} 
        selectedTime={selectedTime} 
      />

      <SecureCheckoutButton
        selectedService={selectedService}
        selectedTime={selectedTime}
        user={user}
        isProcessingPayment={isProcessingPayment}
        onBookingAndPayment={onBookingAndPayment}
      />

      <SecurityNotice />
    </motion.div>
  );
};

export default BookingDetails;
