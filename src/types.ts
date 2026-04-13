import type { InputHTMLAttributes } from "react";

/** Address returned by the French government address API (api-adresse.data.gouv.fr) */
export interface FrenchAddress {
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
export interface FrenchPostalCity {
  /** 5-digit French postal code */
  postcode: string;
  /** City name */
  city: string;
  /** INSEE city code */
  citycode: string;
}

/** Company data returned by the French company search API */
export interface FrenchCompany {
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
export interface BaseInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onSelect" | "onError"
  > {
  /** CSS class name */
  className?: string;
}

/** Props for AddressInput component */
export interface AddressInputProps extends BaseInputProps {
  /** Called when the user selects an address from the dropdown */
  onSelect?: (address: FrenchAddress) => void;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
}

/** Props for PostalCodeInput component */
export interface PostalCodeInputProps extends BaseInputProps {
  /** Called when the user selects a city for the postal code */
  onSelect?: (value: FrenchPostalCity) => void;
}

/** Props for SiretInput component */
export interface SiretInputProps extends BaseInputProps {
  /** Called when a valid SIRET is entered and company data is fetched */
  onFetch?: (company: FrenchCompany) => void;
  /** Called when SIRET validation or fetch fails */
  onError?: (error: string) => void;
}

/** Props for IbanInput component */
export interface IbanInputProps extends BaseInputProps {
  /** Called on every change with the raw IBAN value and validity */
  onChange?: (value: string, isValid: boolean) => void;
}

/** Props for PhoneInput component */
export interface PhoneInputProps extends BaseInputProps {
  /** Called on every change with the raw phone value and validity */
  onChange?: (value: string, isValid: boolean) => void;
}
