import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from "react";
import { ADDRESS_API_URL } from "../../constants";
import type { PostalCodeInputProps, FrenchPostalCity } from "../../types";

/**
 * Input for French postal codes (code postal).
 * When a 5-digit code is entered, queries api-adresse.data.gouv.fr to suggest matching cities.
 * No API key required - this is a free public API.
 *
 * Headless: unstyled by default, accepts className and style props.
 */
export function PostalCodeInput({
  onSelect,
  className,
  style,
  ...inputProps
}: PostalCodeInputProps) {
  const [value, setValue] = useState("");
  const [cities, setCities] = useState<FrenchPostalCity[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 5) {
      setCities([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const url = `${ADDRESS_API_URL}?q=${digits}&type=municipality&limit=10`;
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const results: FrenchPostalCity[] = (data.features ?? [])
          .map((f: Record<string, unknown>) => {
            const props = f.properties as Record<string, unknown>;
            return {
              postcode: props.postcode as string,
              city: props.city as string,
              citycode: props.citycode as string,
            };
          })
          .filter((c: FrenchPostalCity) => c.postcode === digits);
        setCities(results);
        setIsOpen(results.length > 0);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setCities([]);
      });

    return () => controller.abort();
  }, [value]);

  const selectCity = useCallback(
    (city: FrenchPostalCity) => {
      setValue(city.postcode);
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect?.(city);
    },
    [onSelect]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || cities.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i < cities.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : cities.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < cities.length) {
          selectCity(cities[activeIndex]);
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
        inputMode="numeric"
        maxLength={5}
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
          setValue(digits);
          setActiveIndex(-1);
        }}
        onFocus={() => cities.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />
      {isOpen && cities.length > 0 && (
        <ul
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
          {cities.length === 1 ? (
            // Auto-select if there's only one match
            (() => {
              selectCity(cities[0]);
              return null;
            })()
          ) : (
            cities.map((city, index) => (
              <li
                key={`${city.citycode}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={() => selectCity(city)}
                onMouseEnter={() => setActiveIndex(index)}
                style={{
                  cursor: "pointer",
                  fontWeight: index === activeIndex ? "bold" : "normal",
                }}
              >
                {city.postcode} - {city.city}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
