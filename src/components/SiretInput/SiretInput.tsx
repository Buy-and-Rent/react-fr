import { useState, useEffect } from "react";
import { useSiretLookup } from "./useSiretLookup";
import type { SiretInputProps } from "../../types";

/**
 * Input for French SIRET numbers (14 digits).
 * Validates format client-side with the Luhn algorithm, then fetches company
 * data from recherche-entreprises.api.gouv.fr - no API key required.
 *
 * Shows loading state during API fetch.
 * Headless: unstyled by default, accepts className and style props.
 */
export function SiretInput({
  onFetch,
  onError,
  className,
  style,
  ...inputProps
}: SiretInputProps) {
  const [value, setValue] = useState("");
  const cleaned = value.replace(/\s/g, "");
  const { company, isLoading, error } = useSiretLookup(cleaned);

  useEffect(() => {
    if (company) onFetch?.(company);
  }, [company, onFetch]);

  useEffect(() => {
    if (error) onError?.(error);
  }, [error, onError]);

  const formatSiret = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 14);
    // Format as: 123 456 789 00012
    const parts: string[] = [];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 9));
    if (digits.length > 9) parts.push(digits.slice(9, 14));
    return parts.join(" ");
  };

  return (
    <div style={style} className={className}>
      <input
        {...inputProps}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(formatSiret(e.target.value))}
        aria-busy={isLoading}
        aria-invalid={error ? true : undefined}
      />
      {isLoading && (
        <span role="status" aria-live="polite">
          Recherche en cours...
        </span>
      )}
    </div>
  );
}
