import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { useAddressSearch } from "./useAddressSearch";
import type { AddressInputProps, FrenchAddress } from "../../types";

/**
 * Autocomplete input for French addresses.
 * Uses the free api-adresse.data.gouv.fr API - no API key required.
 *
 * Features:
 * - Debounced search (configurable, default 300ms)
 * - Keyboard navigation (ArrowUp/Down, Enter, Escape)
 * - Headless: unstyled by default, accepts className and style props
 */
export function AddressInput({
  onSelect,
  debounceMs = 300,
  className,
  style,
  ...inputProps
}: AddressInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, isLoading } = useAddressSearch(query, debounceMs);
  const listRef = useRef<HTMLUListElement>(null);

  const selectAddress = useCallback(
    (address: FrenchAddress) => {
      setQuery(address.label);
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect?.(address);
    },
    [onSelect]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          selectAddress(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div style={{ position: "relative", ...style }} className={className}>
      <input
        {...inputProps}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-busy={isLoading}
      />
      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 1000,
          }}
        >
          {results.map((address, index) => (
            <li
              key={`${address.label}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={() => selectAddress(address)}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                cursor: "pointer",
                fontWeight: index === activeIndex ? "bold" : "normal",
              }}
            >
              {address.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
