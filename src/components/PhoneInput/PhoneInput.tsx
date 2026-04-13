import { useState, useCallback } from "react";
import type { PhoneInputProps } from "../../types";

/**
 * Formats a French phone number as: 06 12 34 56 78
 */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 2) {
    groups.push(digits.slice(i, i + 2));
  }
  return groups.join(" ");
}

/**
 * Validates a French phone number.
 * Must be 10 digits, starting with 01-09.
 */
function isValidFrenchPhone(digits: string): boolean {
  return /^0[1-9]\d{8}$/.test(digits);
}

/**
 * Input for French phone numbers (format: 06 12 34 56 78).
 * Client-side only - no API calls.
 *
 * Validates that the number starts with a valid French prefix (01-09)
 * and contains exactly 10 digits.
 * Headless: unstyled by default, accepts className and style props.
 */
export function PhoneInput({
  onChange,
  className,
  style,
  ...inputProps
}: PhoneInputProps) {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value);
      setValue(formatted);
      const digits = formatted.replace(/\s/g, "");
      onChange?.(digits, isValidFrenchPhone(digits));
    },
    [onChange]
  );

  const digits = value.replace(/\s/g, "");
  const valid = digits.length > 0 ? isValidFrenchPhone(digits) : undefined;

  return (
    <input
      {...inputProps}
      type="tel"
      value={value}
      onChange={handleChange}
      className={className}
      style={style}
      aria-invalid={valid === false ? true : undefined}
      autoComplete="tel"
    />
  );
}
