# @buyandrent/react-fr

React input components for French SaaS applications — address autocomplete, SIRET lookup, IBAN validation, phone formatting. No API key required.

> **Used in production at [buyandrent.fr](https://buyandrent.fr)**

## Install

```bash
npm i @buyandrent/react-fr
```

## Components

### AddressInput

Autocomplete input for French addresses using the Base Adresse Nationale API.

```tsx
import { AddressInput } from "@buyandrent/react-fr";

function MyForm() {
  return (
    <AddressInput
      placeholder="Saisissez une adresse"
      onSelect={(address) => {
        console.log(address.label);      // "12 Rue de la Paix 75002 Paris"
        console.log(address.postcode);   // "75002"
        console.log(address.lat);        // 48.8698
      }}
    />
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(address: FrenchAddress) => void` | — | Called when an address is selected |
| `debounceMs` | `number` | `300` | Debounce delay in ms |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline styles |
| `...rest` | `InputHTMLAttributes` | — | All standard input props |

### PostalCodeInput

Input for French postal codes. Auto-suggests matching cities on 5-digit input.

```tsx
import { PostalCodeInput } from "@buyandrent/react-fr";

function MyForm() {
  return (
    <PostalCodeInput
      placeholder="Code postal"
      onSelect={({ postcode, city, citycode }) => {
        console.log(`${postcode} ${city}`); // "75002 Paris"
      }}
    />
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(value: FrenchPostalCity) => void` | — | Called when a city is selected |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline styles |

### SiretInput

Input for French SIRET numbers with client-side Luhn validation and company lookup.

```tsx
import { SiretInput } from "@buyandrent/react-fr";

function MyForm() {
  return (
    <SiretInput
      placeholder="Numéro SIRET"
      onFetch={(company) => {
        console.log(company.name);       // "GOOGLE FRANCE"
        console.log(company.siret);      // "44306184100047"
        console.log(company.isActive);   // true
      }}
      onError={(error) => console.error(error)}
    />
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFetch` | `(company: FrenchCompany) => void` | — | Called with company data on valid SIRET |
| `onError` | `(error: string) => void` | — | Called on validation or fetch error |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline styles |

### IbanInput

IBAN input with live formatting (groups of 4) and ISO 13616 checksum validation.

```tsx
import { IbanInput } from "@buyandrent/react-fr";

function MyForm() {
  return (
    <IbanInput
      placeholder="FR76 XXXX XXXX ..."
      onChange={(value, isValid) => {
        console.log(value);    // "FR7630001007941234567890185"
        console.log(isValid);  // true
      }}
    />
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(value: string, isValid: boolean) => void` | — | Called on every change with raw value and validity |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline styles |

### PhoneInput

French phone number input with live formatting and validation.

```tsx
import { PhoneInput } from "@buyandrent/react-fr";

function MyForm() {
  return (
    <PhoneInput
      placeholder="06 12 34 56 78"
      onChange={(value, isValid) => {
        console.log(value);    // "0612345678"
        console.log(isValid);  // true
      }}
    />
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(value: string, isValid: boolean) => void` | — | Called on every change with raw value and validity |
| `className` | `string` | — | CSS class name |
| `style` | `CSSProperties` | — | Inline styles |

## Hooks

### useAddressSearch

Standalone hook for the French address API.

```tsx
import { useAddressSearch } from "@buyandrent/react-fr";

function MyComponent() {
  const { results, isLoading } = useAddressSearch("12 rue de la paix paris");
  // results: FrenchAddress[]
}
```

### useSiretLookup

Standalone hook for SIRET company lookup.

```tsx
import { useSiretLookup } from "@buyandrent/react-fr";

function MyComponent() {
  const { company, isLoading, error } = useSiretLookup("44306184100047");
  // company: FrenchCompany | null
}
```

### isValidSiretFormat

Utility function to validate SIRET format with Luhn algorithm.

```tsx
import { isValidSiretFormat } from "@buyandrent/react-fr";

isValidSiretFormat("44306184100047"); // true
isValidSiretFormat("12345678901234"); // false
```

## No API key required

All API calls use free, public French government APIs:

| Component | API | Documentation |
|-----------|-----|---------------|
| AddressInput, PostalCodeInput | [api-adresse.data.gouv.fr](https://adresse.data.gouv.fr/api-doc/adresse) | Base Adresse Nationale — free, no key, no rate limit for reasonable use |
| SiretInput | [recherche-entreprises.api.gouv.fr](https://recherche-entreprises.api.gouv.fr) | Recherche Entreprises — free, no key |
| IbanInput, PhoneInput | None | Client-side validation only |

## Styling

All components are headless (unstyled) by default. Pass `className` and `style` props to style them, or wrap them in your design system.

## License

MIT
