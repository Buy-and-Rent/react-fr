import * as react_jsx_runtime from 'react/jsx-runtime';
import { InputHTMLAttributes } from 'react';

/** Address returned by the French government address API (api-adresse.data.gouv.fr) */
interface FrenchAddress {
    /** Full formatted address string */
    label: string;
    /** House number (e.g. "12") */
    housenumber: string;
    /** Street name */
    street: string;
    /** City name */
    city: string;
    /** 5-digit French postal code */
    postcode: string;
    /** INSEE city code */
    citycode: string;
    /** Longitude */
    lon: number;
    /** Latitude */
    lat: number;
}
/** Postal code + city selection */
interface FrenchPostalCity {
    /** 5-digit French postal code */
    postcode: string;
    /** City name */
    city: string;
    /** INSEE city code */
    citycode: string;
}
/** Company data returned by the French company search API */
interface FrenchCompany {
    /** 14-digit SIRET number */
    siret: string;
    /** 9-digit SIREN number (first 9 digits of SIRET) */
    siren: string;
    /** Company legal name */
    name: string;
    /** Registered address */
    address: string;
    /** 5-digit postal code */
    postalCode: string;
    /** City name */
    city: string;
    /** Whether the company is currently active */
    isActive: boolean;
}
/** Base props shared by all input components */
interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onSelect" | "onError"> {
    /** CSS class name */
    className?: string;
}
/** Props for AddressInput component */
interface AddressInputProps extends BaseInputProps {
    /** Called when the user selects an address from the dropdown */
    onSelect?: (address: FrenchAddress) => void;
    /** Debounce delay in milliseconds (default: 300) */
    debounceMs?: number;
}
/** Props for PostalCodeInput component */
interface PostalCodeInputProps extends BaseInputProps {
    /** Called when the user selects a city for the postal code */
    onSelect?: (value: FrenchPostalCity) => void;
}
/** Props for SiretInput component */
interface SiretInputProps extends BaseInputProps {
    /** Called when a valid SIRET is entered and company data is fetched */
    onFetch?: (company: FrenchCompany) => void;
    /** Called when SIRET validation or fetch fails */
    onError?: (error: string) => void;
}
/** Props for IbanInput component */
interface IbanInputProps extends BaseInputProps {
    /** Called on every change with the raw IBAN value and validity */
    onChange?: (value: string, isValid: boolean) => void;
}
/** Props for PhoneInput component */
interface PhoneInputProps extends BaseInputProps {
    /** Called on every change with the raw phone value and validity */
    onChange?: (value: string, isValid: boolean) => void;
}

/**
 * Autocomplete input for French addresses.
 * Uses the free api-adresse.data.gouv.fr API — no API key required.
 *
 * Features:
 * - Debounced search (configurable, default 300ms)
 * - Keyboard navigation (ArrowUp/Down, Enter, Escape)
 * - Headless: unstyled by default, accepts className and style props
 */
declare function AddressInput({ onSelect, debounceMs, className, style, ...inputProps }: AddressInputProps): react_jsx_runtime.JSX.Element;

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
declare function useAddressSearch(query: string, debounceMs?: number): AddressSearchResult;

/**
 * Input for French postal codes (code postal).
 * When a 5-digit code is entered, queries api-adresse.data.gouv.fr to suggest matching cities.
 * No API key required — this is a free public API.
 *
 * Headless: unstyled by default, accepts className and style props.
 */
declare function PostalCodeInput({ onSelect, className, style, ...inputProps }: PostalCodeInputProps): react_jsx_runtime.JSX.Element;

/**
 * Input for French SIRET numbers (14 digits).
 * Validates format client-side with the Luhn algorithm, then fetches company
 * data from recherche-entreprises.api.gouv.fr — no API key required.
 *
 * Shows loading state during API fetch.
 * Headless: unstyled by default, accepts className and style props.
 */
declare function SiretInput({ onFetch, onError, className, style, ...inputProps }: SiretInputProps): react_jsx_runtime.JSX.Element;

interface SiretLookupResult {
    company: FrenchCompany | null;
    isLoading: boolean;
    error: string | null;
}
/**
 * Validates a SIRET number using the Luhn algorithm.
 * A valid SIRET has exactly 14 digits and passes the Luhn checksum.
 */
declare function isValidSiretFormat(siret: string): boolean;
/**
 * Hook that looks up a SIRET number on recherche-entreprises.api.gouv.fr.
 * Validates the format client-side first (14 digits, Luhn algorithm),
 * then fetches company data from the free public API — no API key required.
 *
 * @param siret - The 14-digit SIRET number to look up
 */
declare function useSiretLookup(siret: string): SiretLookupResult;

/**
 * Input for IBAN numbers with live formatting and validation.
 * Client-side only — no API calls. Validates using the ISO 13616 checksum algorithm.
 *
 * Formats as user types in groups of 4: FR76 3000 1007 ...
 * Headless: unstyled by default, accepts className and style props.
 */
declare function IbanInput({ onChange, className, style, ...inputProps }: IbanInputProps): react_jsx_runtime.JSX.Element;

/**
 * Input for French phone numbers (format: 06 12 34 56 78).
 * Client-side only — no API calls.
 *
 * Validates that the number starts with a valid French prefix (01-09)
 * and contains exactly 10 digits.
 * Headless: unstyled by default, accepts className and style props.
 */
declare function PhoneInput({ onChange, className, style, ...inputProps }: PhoneInputProps): react_jsx_runtime.JSX.Element;

export { AddressInput, type AddressInputProps, type BaseInputProps, type FrenchAddress, type FrenchCompany, type FrenchPostalCity, IbanInput, type IbanInputProps, PhoneInput, type PhoneInputProps, PostalCodeInput, type PostalCodeInputProps, SiretInput, type SiretInputProps, isValidSiretFormat, useAddressSearch, useSiretLookup };
