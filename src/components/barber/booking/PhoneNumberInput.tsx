
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { motion } from 'framer-motion';

interface PhoneNumberInputProps {
  userPhone: string;
  setUserPhone: (phone: string) => void;
}

const PhoneNumberInput = ({ userPhone, setUserPhone }: PhoneNumberInputProps) => {
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
    <motion.div 
      className="space-y-2"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Phone className="w-4 h-4" />
        Phone Number
      </Label>
      <Input
        id="phone"
        type="tel"
        placeholder="(555) 123-4567"
        value={userPhone}
        onChange={handlePhoneChange}
        className="w-full h-12 transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
        maxLength={14}
      />
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <span>📱 Optional - We'll send appointment confirmations</span>
      </p>
    </motion.div>
  );
};

export default PhoneNumberInput;
