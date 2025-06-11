
// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const isRateLimited = (userId: string, maxRequests: number = 5, windowMs: number = 300000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (userRequests.count >= maxRequests) {
    return true;
  }
  
  userRequests.count++;
  return false;
};
