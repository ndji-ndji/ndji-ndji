/**
 * Validators for Congo Phone Numbers and general form fields
 */

/**
 * Validates a Congo phone number.
 * Supported formats:
 * - 05 XXX XX XX or 06 XXX XX XX (9 digits)
 * - +242 05 XXX XX XX or +242 06 XXX XX XX (with country code)
 * - +242 5 XXX XX XX or +242 6 XXX XX XX (without leading zero after country code)
 */
export function validateCongoPhone(phone: string): boolean {
  // Remove all spaces, dashes and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Format check
  // Pattern 1: Local format (05xxxxxxx or 06xxxxxxx) - 9 digits
  const localPattern = /^0[56]\d{7}$/;
  
  // Pattern 2: International format (+242 05xxxxxxx or +242 06xxxxxxx or +242 5xxxxxxx or +242 6xxxxxxx)
  const internationalPattern = /^\+242(0?[56])\d{7}$/;
  
  // Pattern 3: International format without leading '+' (242xxxxxxx)
  const internationalNoPlusPattern = /^242(0?[56])\d{7}$/;

  return localPattern.test(cleaned) || internationalPattern.test(cleaned) || internationalNoPlusPattern.test(cleaned);
}

/**
 * Normalizes a Congo phone number to the standard international format +242XXXXXXXXX
 */
export function normalizeCongoPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (/^0[56]\d{7}$/.test(cleaned)) {
    // Local: add +242, remove the leading zero
    return `+242${cleaned.substring(1)}`;
  }
  
  if (/^\+2420[56]\d{7}$/.test(cleaned)) {
    // International with leading zero: remove leading zero inside
    return `+242${cleaned.substring(5)}`;
  }
  
  if (/^2420[56]\d{7}$/.test(cleaned)) {
    // International with 242 and leading zero: add '+' and remove leading zero inside
    return `+242${cleaned.substring(4)}`;
  }
  
  if (/^242[56]\d{7}$/.test(cleaned)) {
    // International with 242: add '+'
    return `+242${cleaned.substring(3)}`;
  }
  
  if (/^\+242[56]\d{7}$/.test(cleaned)) {
    return cleaned;
  }
  
  return phone; // Return as-is if it doesn't match standard prefixes
}

/**
 * Validates budget inputs.
 * If both are set, budget_max must be >= budget_min. Both must be positive.
 */
export function validateBudget(min: number | undefined, max: number | undefined): boolean {
  if (min !== undefined && min < 0) return false;
  if (max !== undefined && max < 0) return false;
  if (min !== undefined && max !== undefined && max < min) return false;
  return true;
}
