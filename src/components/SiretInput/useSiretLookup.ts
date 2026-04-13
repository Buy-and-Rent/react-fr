import { useState, useEffect, useRef } from "react";
import { ENTREPRISE_API_URL } from "../../constants";
import type { FrenchCompany } from "../../types";

interface SiretLookupResult {
  company: FrenchCompany | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Validates a SIRET number using the Luhn algorithm.
 * A valid SIRET has exactly 14 digits and passes the Luhn checksum.
 */
export function isValidSiretFormat(siret: string): boolean {
  const digits = siret.replace(/\s/g, "");
  if (!/^\d{14}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Hook that looks up a SIRET number on recherche-entreprises.api.gouv.fr.
 * Validates the format client-side first (14 digits, Luhn algorithm),
 * then fetches company data from the free public API — no API key required.
 *
 * @param siret - The 14-digit SIRET number to look up
 */
export function useSiretLookup(siret: string): SiretLookupResult {
  const [company, setCompany] = useState<FrenchCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const cleaned = siret.replace(/\s/g, "");

    if (cleaned.length !== 14) {
      setCompany(null);
      setError(null);
      return;
    }

    if (!isValidSiretFormat(cleaned)) {
      setCompany(null);
      setError("Numéro SIRET invalide (checksum Luhn)");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    const url = `${ENTREPRISE_API_URL}?q=${cleaned}`;
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const results = data.results as Record<string, unknown>[] | undefined;
        if (!results || results.length === 0) {
          setError("Aucune entreprise trouvée pour ce SIRET");
          setCompany(null);
          return;
        }

        const match = results[0];
        const siege = match.siege as Record<string, unknown> | undefined;

        const result: FrenchCompany = {
          siret: cleaned,
          siren: cleaned.slice(0, 9),
          name: (match.nom_complet as string) ?? "",
          address: (siege?.adresse_ligne_1 as string) ?? "",
          postalCode: (siege?.code_postal as string) ?? "",
          city: (siege?.commune as string) ?? "",
          isActive: (match.etat_administratif as string) === "A",
        };
        setCompany(result);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Erreur lors de la recherche SIRET");
          setCompany(null);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [siret]);

  return { company, isLoading, error };
}
