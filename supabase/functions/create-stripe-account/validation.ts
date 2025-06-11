
// Enhanced input validation utilities
export const validateUserId = (userId: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"&]/g, (char) => {
    const entityMap: { [key: string]: string } = {
      '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'
    };
    return entityMap[char] || char;
  }).trim();
};

export const validateRequestData = (requestData: any) => {
  const { barber_id } = requestData;

  if (!barber_id || typeof barber_id !== 'string') {
    throw new Error("Missing required field: barber_id");
  }

  if (!validateUserId(barber_id)) {
    throw new Error("Invalid barber_id format");
  }

  return { barber_id };
};

export const validateOrigin = (origin: string | null): void => {
  if (!origin || (!origin.includes('lovable.app') && !origin.includes('localhost'))) {
    throw new Error("Invalid request origin");
  }
};
