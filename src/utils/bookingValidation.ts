
import { validatePhoneNumber as baseValidatePhone } from './securityHelpers';

export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return false;
  
  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Enhanced validation: must be 7-15 digits, starting with non-zero
  const phoneRegex = /^[1-9]\d{6,14}$/;
  
  return phoneRegex.test(cleanPhone) && baseValidatePhone(phone);
};

export const validateBookingData = (data: {
  selectedService: any;
  selectedTime: string;
  userPhone?: string;
  user: any;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.selectedService) {
    errors.push('Service selection is required');
  }

  if (!data.selectedTime) {
    errors.push('Time selection is required');
  }

  if (!data.user) {
    errors.push('User authentication is required');
  }

  if (data.userPhone && !validatePhoneNumber(data.userPhone)) {
    errors.push('Valid phone number is required');
  }

  if (data.selectedService?.price && typeof data.selectedService.price !== 'number') {
    errors.push('Invalid service price');
  }

  if (data.selectedService?.price && data.selectedService.price <= 0) {
    errors.push('Service price must be greater than zero');
  }

  if (data.selectedService?.price && data.selectedService.price > 1000) {
    errors.push('Service price exceeds maximum limit');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
