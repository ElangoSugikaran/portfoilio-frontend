import { format, parseISO, isValid } from 'date-fns';

/**
 * Safely parses a date input (ISO string, timestamp, Date instance, or year string).
 */
export function safeParseDate(dateInput?: string | Date | null): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return isValid(dateInput) ? dateInput : null;

  // Handle pure year string like "2023"
  if (typeof dateInput === 'string' && /^\d{4}$/.test(dateInput.trim())) {
    const yearDate = new Date(parseInt(dateInput, 10), 0, 1);
    return isValid(yearDate) ? yearDate : null;
  }

  try {
    const parsed = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (isValid(parsed)) return parsed;
    // Fallback to native Date parser
    const fallback = new Date(dateInput);
    return isValid(fallback) ? fallback : null;
  } catch {
    return null;
  }
}

/**
 * Formats a single date into a readable string (e.g. "Jan 2023").
 */
export function formatDate(dateInput?: string | Date | null, formatStr: string = 'MMM yyyy'): string {
  const date = safeParseDate(dateInput);
  if (!date) {
    return typeof dateInput === 'string' ? dateInput : '';
  }
  return format(date, formatStr);
}

/**
 * Formats a date range into a consistent string (e.g., "Jan 2022 – Dec 2023", "Mar 2024 – Present").
 */
export function formatDateRange(
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  isCurrent?: boolean
): string {
  if (!startDate && !endDate) return '';

  const startFormatted = startDate ? formatDate(startDate) : '';

  if (isCurrent) {
    return startFormatted ? `${startFormatted} – Present` : 'Present';
  }

  const endFormatted = endDate ? formatDate(endDate) : 'Present';

  if (!startFormatted) return endFormatted;
  return `${startFormatted} – ${endFormatted}`;
}
