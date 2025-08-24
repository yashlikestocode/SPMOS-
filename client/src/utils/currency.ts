export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const formatCurrencyDetailed = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateGST = (amount: number, rate: number = 18): number => {
  return (amount * rate) / 100;
};

export const calculateTotalWithGST = (amount: number, gstRate: number = 18): number => {
  return amount + calculateGST(amount, gstRate);
};
