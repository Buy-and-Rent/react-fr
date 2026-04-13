// Components
export { AddressInput } from "./components/AddressInput";
export { PostalCodeInput } from "./components/PostalCodeInput";
export { SiretInput } from "./components/SiretInput";
export { IbanInput } from "./components/IbanInput";
export { PhoneInput } from "./components/PhoneInput";

// Hooks
export { useAddressSearch } from "./components/AddressInput";
export { useSiretLookup, isValidSiretFormat } from "./components/SiretInput";

// Types
export type {
  FrenchAddress,
  FrenchPostalCity,
  FrenchCompany,
  BaseInputProps,
  AddressInputProps,
  PostalCodeInputProps,
  SiretInputProps,
  IbanInputProps,
  PhoneInputProps,
} from "./types";
