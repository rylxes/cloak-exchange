
// Privacy enhancement utilities
export const generateStealthAddress = (address: string): string => {
  // In a real implementation, this would generate a one-time stealth address
  // For demo purposes, we're adding a simple prefix
  return `st_${address}`;
};

export const getPrivacyLevel = (amount: number): 'low' | 'medium' | 'high' => {
  if (amount < 1) return 'low';
  if (amount < 10) return 'medium';
  return 'high';
};

export const getSuggestedMixers = (amount: number): number => {
  // Suggest number of mixers based on amount
  return Math.min(Math.ceil(amount / 5), 10);
};
