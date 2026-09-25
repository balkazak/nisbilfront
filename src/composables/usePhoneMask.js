/**
 * Phone Mask and Validation Composable
 * Enforces +7 (###) ### ## ## format and strict validation
 */

/**
 * Formats any input string into +7 (###) ### ## ##
 * @param {string} val Current input value
 * @param {string} prevVal Previous input value for backspace handling
 * @returns {string} Formatted phone string
 */
export function formatPhoneNumber(val, prevVal = '') {
  if (!val) return '';
  const clean = String(val).trim();

  // If user deleted down to just "+", "+7", "+7 (", "+7 ()" or backspaced to empty
  if (
    clean === '+' ||
    clean === '+7' ||
    clean === '+7 (' ||
    clean === '+7 ()' ||
    clean === '(' ||
    clean === '+7 '
  ) {
    return '';
  }

  const hasPlus = clean.startsWith('+');
  let digits = clean.replace(/\D/g, '');

  if (!digits) return '';

  // If user hit backspace on a formatting character (e.g. ')', ' ', '-')
  if (prevVal && prevVal.length > clean.length) {
    const prevDigits = prevVal.replace(/\D/g, '');
    if (prevDigits === digits && digits.length > 0) {
      digits = digits.slice(0, -1);
    }
  }

  // Handle leading country/trunk codes:
  // Case 1: 11 digits starting with 7 or 8 (e.g. 77071234567 or 87071234567) -> strip first digit
  if (digits.length >= 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    digits = digits.slice(1);
  }
  // Case 2: User started typing '8' as trunk prefix (e.g. 8707...)
  else if (digits.length > 1 && digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  // Case 3: Typed with + prefix (+7707...)
  else if (hasPlus && digits.startsWith('7')) {
    digits = digits.slice(1);
  }
  // Case 4: Exactly 1 digit entered on empty input (user typed 7 or 8)
  else if (digits.length === 1 && (digits === '7' || digits === '8')) {
    return '+7 (';
  }

  digits = digits.slice(0, 10);
  if (!digits.length) return '';

  let res = '+7 (' + digits.substring(0, 3);
  if (digits.length >= 3) {
    res += ') ' + digits.substring(3, 6);
  }
  if (digits.length >= 6) {
    res += ' ' + digits.substring(6, 8);
  }
  if (digits.length >= 8) {
    res += ' ' + digits.substring(8, 10);
  }

  return res.trim();
}

/**
 * Validates if the phone number has a full 10 digits after +7
 * @param {string} val Phone number string
 * @returns {boolean} True if completely filled and valid
 */
export function isValidPhoneNumber(val) {
  if (!val || typeof val !== 'string') return false;
  let digits = val.replace(/\D/g, '');
  if ((digits.startsWith('7') || digits.startsWith('8')) && digits.length === 11) {
    return true;
  }
  return digits.length === 10;
}

/**
 * Returns raw digits (10 digits) without country prefix
 * @param {string} val Phone number string
 * @returns {string} 10-digit number
 */
export function getPhoneDigits(val) {
  if (!val || typeof val !== 'string') return '';
  let digits = val.replace(/\D/g, '');
  if ((digits.startsWith('7') || digits.startsWith('8')) && digits.length === 11) {
    return digits.slice(1);
  }
  return digits.slice(0, 10);
}

/**
 * Normalizes phone number into standard +7 (###) ### ## ##
 * @param {string} val Raw or partially formatted phone
 * @returns {string} Normalized phone string
 */
export function normalizePhoneNumber(val) {
  if (!val) return '';
  return formatPhoneNumber(val);
}

/**
 * Vue Composable for phone mask handling
 */
export function usePhoneMask() {
  /**
   * Helper to handle input event in templates:
   * Usage: @input="(e) => handlePhoneInput(e, form, 'phone')"
   * or: @input="(e) => handlePhoneInput(e, (v) => form.phone = v)"
   */
  const handlePhoneInput = (event, target, key) => {
    const input = event.target;
    const currentVal = input.value;
    let prevVal = '';

    if (typeof target === 'object' && target !== null && key) {
      prevVal = target[key] || '';
    } else if (target && typeof target === 'object' && 'value' in target) {
      prevVal = target.value || '';
    }

    const formatted = formatPhoneNumber(currentVal, prevVal);

    if (typeof target === 'function') {
      target(formatted);
    } else if (target && typeof target === 'object') {
      if (key) {
        target[key] = formatted;
      } else if ('value' in target) {
        target.value = formatted;
      }
    }

    input.value = formatted;
  };

  return {
    formatPhoneNumber,
    isValidPhoneNumber,
    getPhoneDigits,
    normalizePhoneNumber,
    handlePhoneInput
  };
}

export default usePhoneMask;
