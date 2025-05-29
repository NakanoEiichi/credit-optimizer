import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, isWithinInterval } from "date-fns";

/**
 * Get date range for a period (week, month, year)
 */
export const getDateRange = (period: 'week' | 'month' | 'year') => {
  const today = new Date();
  
  switch (period) {
    case 'week':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(today, { weekStartsOn: 1 }) // Sunday
      };
    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today)
      };
    case 'year':
      return {
        start: startOfYear(today),
        end: endOfYear(today)
      };
    default:
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 })
      };
  }
};

/**
 * Check if a date is within the given period
 */
export const isDateInPeriod = (date: Date, period: 'week' | 'month' | 'year'): boolean => {
  const range = getDateRange(period);
  return isWithinInterval(date, { start: range.start, end: range.end });
};

/**
 * Format a date with a specific format
 */
export const formatDate = (date: Date, formatStr: string = 'yyyy/MM/dd'): string => {
  return format(date, formatStr);
};

/**
 * Get a relative date (e.g. "今日", "昨日", "3日前")
 */
export const getRelativeDate = (date: Date): string => {
  const today = new Date();
  const yesterday = subDays(today, 1);
  const tomorrow = addDays(today, 1);
  
  if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return '今日';
  } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return '昨日';
  } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
    return '明日';
  }
  
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (date < today) {
    return `${diffDays}日前`;
  } else {
    return `${diffDays}日後`;
  }
};
