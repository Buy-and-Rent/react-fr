import { useState, useCallback } from "react";
import type { IbanInputProps } from "../../types";

/**
 * Validates an IBAN using the ISO 13616 checksum algorithm.
 * Moves the first 4 characters to the end, converts letters to numbers (A=10, B=11...),
 * then checks if the resulting number mod 97 equals 1.
 */
function isValidIban(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) return false;

  // Move first 4 chars to end
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericStr = "";
  for (const char of rearranged) {
    if (char >= "A" && char <= "Z") {
      numericStr += (char.charCodeAt(0) - 55).toString();
    } else {
      numericStr += char;
    }
  }

  // Mod 97 using string chunks (number too large for JS integers)
  let remainder = 0;
  for (let i = 0; i < numericStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numericStr[i], 10)) % 97;
  }

  return remainder === 1;
}

/**
 * Formats an IBAN string into groups of 4 characters.
 */
function formatIban(raw: string): string {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 34);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Input for IBAN numbers with live formatting and validation.
 * Client-side only — no API calls. Validates using the ISO 13616 checksum algorithm.
 *
 * Formats as user types in groups of 4: FR76 3000 1007 ...
 * Headless: unstyled by default, accepts className and style props.
 */
export function IbanInput({
  onChange,
  className,
  style,
  ...inputProps
}: IbanInputProps) {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatIban(e.target.value);
      setValue(formatted);
      const raw = formatted.replace(/\s/g, "");
      onChange?.(raw, isValidIban(raw));
    },
    [onChange]
  );

  const raw = value.replace(/\s/g, "");
  const valid = raw.length > 0 ? isValidIban(raw) : undefined;

  return (
    <input
      {...inputProps}
      type="text"
      value={value}
      onChange={handleChange}
      className={className}
      style={style}
      aria-invalid={valid === false ? true : undefined}
      autoComplete="off"
      spellCheck={false}
    />
  );
}
