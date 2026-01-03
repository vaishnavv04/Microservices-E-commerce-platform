/**
 * Currency utility functions for formatting prices in INR
 */

/**
 * Format amount in Indian Rupees (INR)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "₹1,499.00")
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format amount with just the number (no currency symbol)
 * @param {number} amount - The amount to format  
 * @returns {string} Formatted number string (e.g., "1,499.00")
 */
export const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default formatINR;
