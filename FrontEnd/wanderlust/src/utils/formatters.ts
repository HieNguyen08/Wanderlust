/**
 * Utility functions for formatting data
 */

/**
 * Format a Date object to dd/MM/yyyy string
 * Safe to use - returns string even if input is already a string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  
  if (date instanceof Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  return '';
}

/**
 * Format a Date object to Vietnamese day name + date
 * Example: "Thứ 6, 7/11/2025"
 */
export function formatDateWithDay(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  
  if (date instanceof Date) {
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  }
  
  return '';
}

/**
 * Format currency to Vietnamese format
 * Example: 1500000 -> "1.500.000đ"
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

/**
 * Format price with breakdown
 * Example: { base: 1500000, tax: 500000 } -> "2.000.000đ"
 */
export function formatTotalPrice(prices: { [key: string]: number }): string {
  const total = Object.values(prices).reduce((sum, price) => sum + price, 0);
  return formatCurrency(total);
}
