
// Security utility functions

export const sanitizeHtml = (html: string): string => {
  // Remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Enhanced phone validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>'"&]/g, (char) => {
      const entityMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entityMap[char] || char;
    })
    .trim();
};

export const isValidAmount = (amount: number): boolean => {
  return typeof amount === 'number' && 
         amount > 0 && 
         amount <= 100000 && // Max $1000
         Number.isFinite(amount);
};

export const createSecurePostMessageHandler = (allowedOrigins: string[]) => {
  return (event: MessageEvent) => {
    // Validate origin
    if (!allowedOrigins.includes(event.origin)) {
      console.warn('Blocked message from unauthorized origin:', event.origin);
      return;
    }

    // Validate message structure
    if (!event.data || typeof event.data !== 'object') {
      console.warn('Invalid message format received');
      return;
    }

    return event.data;
  };
};
