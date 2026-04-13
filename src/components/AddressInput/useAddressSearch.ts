import { useState, useEffect, useRef } from "react";
import { ADDRESS_API_URL } from "../../constants";
import type { FrenchAddress } from "../../types";

interface AddressSearchResult {
  results: FrenchAddress[];
  isLoading: boolean;
}

/**
 * Hook that searches the French government address API (api-adresse.data.gouv.fr).
 * Returns matching addresses for the given query string.
 * No API key required — this is a free public API.
 *
 * @param query - Search string (e.g. "12 rue de la paix paris")
 * @param debounceMs - Debounce delay in ms (default: 300)
 */
export function useAddressSearch(
  query: string,
  debounceMs = 300
): AddressSearchResult {
  const [results, setResults] = useState<FrenchAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);

      const url = `${ADDRESS_API_URL}?q=${encodeURIComponent(trimmed)}&limit=5`;
      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          const addresses: FrenchAddress[] = (data.features ?? []).map(
            (f: Record<string, unknown>) => {
              const props = f.properties as Record<string, unknown>;
              const geo = f.geometry as { coordinates: number[] };
              return {
                label: props.label as string,
                housenumber: (props.housenumber as string) ?? "",
                street: (props.street as string) ?? "",
                city: props.city as string,
                postcode: props.postcode as string,
                citycode: props.citycode as string,
                lon: geo.coordinates[0],
                lat: geo.coordinates[1],
              };
            }
          );
          setResults(addresses);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setResults([]);
          }
        })
        .finally(() => setIsLoading(false));
    }, debounceMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [query, debounceMs]);

  return { results, isLoading };
}
