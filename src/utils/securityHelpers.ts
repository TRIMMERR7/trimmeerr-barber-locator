
// Security utility functions

// Store original console methods to avoid infinite loops when logging security events
const originalConsole = {
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  log: console.log.bind(console)
};

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
      originalConsole.warn('Blocked message from unauthorized origin:', event.origin);
      return;
    }

    // Validate message structure
    if (!event.data || typeof event.data !== 'object') {
      originalConsole.warn('Invalid message format received');
      return;
    }

    return event.data;
  };
};

// Enhanced validation functions for better security
export const validateUserId = (userId: string): boolean => {
  // UUID v4 validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

export const validateServiceName = (serviceName: string): boolean => {
  // Service name should be alphanumeric with spaces, max 100 chars
  const serviceRegex = /^[a-zA-Z0-9\s\-&]{1,100}$/;
  return serviceRegex.test(serviceName);
};

export const validateBarberName = (name: string): boolean => {
  // Name should contain only letters, spaces, apostrophes, hyphens, max 100 chars
  const nameRegex = /^[a-zA-Z\s'\-]{1,100}$/;
  return nameRegex.test(name);
};

export const validateDateTime = (dateTime: string): boolean => {
  const date = new Date(dateTime);
  const now = new Date();
  
  // Check if valid date and not in the past
  return !isNaN(date.getTime()) && date > now;
};

export const validateStripeAccountId = (accountId: string): boolean => {
  // Stripe account IDs start with 'acct_' followed by 16 alphanumeric characters
  const stripeAccountRegex = /^acct_[a-zA-Z0-9]{16}$/;
  return stripeAccountRegex.test(accountId);
};

export const rateLimiter = (() => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true;
  };
})();

export const logSecurityEvent = (event: string, details: any, severity: 'low' | 'medium' | 'high') => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    severity,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
  };
  
  // Use original console methods to avoid infinite loops
  originalConsole.warn(`[SECURITY ${severity.toUpperCase()}] ${event}:`, logEntry);
  
  // In production, you might want to send this to a logging service
  if (severity === 'high') {
    // Could trigger alerts or additional security measures
    originalConsole.error('HIGH SEVERITY SECURITY EVENT:', logEntry);
  }
};
