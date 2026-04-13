// src/components/AddressInput/AddressInput.tsx
import { useState as useState2, useRef as useRef2, useCallback } from "react";

// src/components/AddressInput/useAddressSearch.ts
import { useState, useEffect, useRef } from "react";

// src/constants.ts
var ADDRESS_API_URL = "https://api-adresse.data.gouv.fr/search";
var ENTREPRISE_API_URL = "https://recherche-entreprises.api.gouv.fr/search";

// src/components/AddressInput/useAddressSearch.ts
function useAddressSearch(query, debounceMs = 300) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);
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
      fetch(url, { signal: controller.signal }).then((res) => res.json()).then((data) => {
        const addresses = (data.features ?? []).map(
          (f) => {
            const props = f.properties;
            const geo = f.geometry;
            return {
              label: props.label,
              housenumber: props.housenumber ?? "",
              street: props.street ?? "",
              city: props.city,
              postcode: props.postcode,
              citycode: props.citycode,
              lon: geo.coordinates[0],
              lat: geo.coordinates[1]
            };
          }
        );
        setResults(addresses);
      }).catch((err) => {
        if (err.name !== "AbortError") {
          setResults([]);
        }
      }).finally(() => setIsLoading(false));
    }, debounceMs);
    return () => {
      clearTimeout(timeout);
    };
  }, [query, debounceMs]);
  return { results, isLoading };
}

// src/components/AddressInput/AddressInput.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function AddressInput({
  onSelect,
  debounceMs = 300,
  className,
  style,
  ...inputProps
}) {
  const [query, setQuery] = useState2("");
  const [isOpen, setIsOpen] = useState2(false);
  const [activeIndex, setActiveIndex] = useState2(-1);
  const { results, isLoading } = useAddressSearch(query, debounceMs);
  const listRef = useRef2(null);
  const selectAddress = useCallback(
    (address) => {
      setQuery(address.label);
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect?.(address);
    },
    [onSelect]
  );
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => i < results.length - 1 ? i + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => i > 0 ? i - 1 : results.length - 1);
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
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", ...style }, className, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ...inputProps,
        type: "text",
        value: query,
        onChange: (e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        },
        onFocus: () => results.length > 0 && setIsOpen(true),
        onBlur: () => setTimeout(() => setIsOpen(false), 200),
        onKeyDown: handleKeyDown,
        role: "combobox",
        "aria-expanded": isOpen,
        "aria-autocomplete": "list",
        "aria-busy": isLoading
      }
    ),
    isOpen && results.length > 0 && /* @__PURE__ */ jsx(
      "ul",
      {
        ref: listRef,
        role: "listbox",
        style: {
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          margin: 0,
          padding: 0,
          listStyle: "none",
          zIndex: 1e3
        },
        children: results.map((address, index) => /* @__PURE__ */ jsx(
          "li",
          {
            role: "option",
            "aria-selected": index === activeIndex,
            onMouseDown: () => selectAddress(address),
            onMouseEnter: () => setActiveIndex(index),
            style: {
              cursor: "pointer",
              fontWeight: index === activeIndex ? "bold" : "normal"
            },
            children: address.label
          },
          `${address.label}-${index}`
        ))
      }
    )
  ] });
}

// src/components/PostalCodeInput/PostalCodeInput.tsx
import { useState as useState3, useEffect as useEffect2, useRef as useRef3, useCallback as useCallback2 } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function PostalCodeInput({
  onSelect,
  className,
  style,
  ...inputProps
}) {
  const [value, setValue] = useState3("");
  const [cities, setCities] = useState3([]);
  const [isOpen, setIsOpen] = useState3(false);
  const [activeIndex, setActiveIndex] = useState3(-1);
  const abortRef = useRef3(null);
  useEffect2(() => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 5) {
      setCities([]);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const url = `${ADDRESS_API_URL}?q=${digits}&type=municipality&limit=10`;
    fetch(url, { signal: controller.signal }).then((res) => res.json()).then((data) => {
      const results = (data.features ?? []).map((f) => {
        const props = f.properties;
        return {
          postcode: props.postcode,
          city: props.city,
          citycode: props.citycode
        };
      }).filter((c) => c.postcode === digits);
      setCities(results);
      setIsOpen(results.length > 0);
    }).catch((err) => {
      if (err.name !== "AbortError") setCities([]);
    });
    return () => controller.abort();
  }, [value]);
  const selectCity = useCallback2(
    (city) => {
      setValue(city.postcode);
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect?.(city);
    },
    [onSelect]
  );
  const handleKeyDown = (e) => {
    if (!isOpen || cities.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => i < cities.length - 1 ? i + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => i > 0 ? i - 1 : cities.length - 1);
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
  return /* @__PURE__ */ jsxs2("div", { style: { position: "relative", ...style }, className, children: [
    /* @__PURE__ */ jsx2(
      "input",
      {
        ...inputProps,
        type: "text",
        inputMode: "numeric",
        maxLength: 5,
        value,
        onChange: (e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
          setValue(digits);
          setActiveIndex(-1);
        },
        onFocus: () => cities.length > 0 && setIsOpen(true),
        onBlur: () => setTimeout(() => setIsOpen(false), 200),
        onKeyDown: handleKeyDown,
        role: "combobox",
        "aria-expanded": isOpen,
        "aria-autocomplete": "list"
      }
    ),
    isOpen && cities.length > 0 && /* @__PURE__ */ jsx2(
      "ul",
      {
        role: "listbox",
        style: {
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          margin: 0,
          padding: 0,
          listStyle: "none",
          zIndex: 1e3
        },
        children: cities.length === 1 ? (
          // Auto-select if there's only one match
          (() => {
            selectCity(cities[0]);
            return null;
          })()
        ) : cities.map((city, index) => /* @__PURE__ */ jsxs2(
          "li",
          {
            role: "option",
            "aria-selected": index === activeIndex,
            onMouseDown: () => selectCity(city),
            onMouseEnter: () => setActiveIndex(index),
            style: {
              cursor: "pointer",
              fontWeight: index === activeIndex ? "bold" : "normal"
            },
            children: [
              city.postcode,
              " \u2014 ",
              city.city
            ]
          },
          `${city.citycode}-${index}`
        ))
      }
    )
  ] });
}

// src/components/SiretInput/SiretInput.tsx
import { useState as useState5, useEffect as useEffect4 } from "react";

// src/components/SiretInput/useSiretLookup.ts
import { useState as useState4, useEffect as useEffect3, useRef as useRef4 } from "react";
function isValidSiretFormat(siret) {
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
function useSiretLookup(siret) {
  const [company, setCompany] = useState4(null);
  const [isLoading, setIsLoading] = useState4(false);
  const [error, setError] = useState4(null);
  const abortRef = useRef4(null);
  useEffect3(() => {
    const cleaned = siret.replace(/\s/g, "");
    if (cleaned.length !== 14) {
      setCompany(null);
      setError(null);
      return;
    }
    if (!isValidSiretFormat(cleaned)) {
      setCompany(null);
      setError("Num\xE9ro SIRET invalide (checksum Luhn)");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);
    const url = `${ENTREPRISE_API_URL}?q=${cleaned}`;
    fetch(url, { signal: controller.signal }).then((res) => res.json()).then((data) => {
      const results = data.results;
      if (!results || results.length === 0) {
        setError("Aucune entreprise trouv\xE9e pour ce SIRET");
        setCompany(null);
        return;
      }
      const match = results[0];
      const siege = match.siege;
      const result = {
        siret: cleaned,
        siren: cleaned.slice(0, 9),
        name: match.nom_complet ?? "",
        address: siege?.adresse_ligne_1 ?? "",
        postalCode: siege?.code_postal ?? "",
        city: siege?.commune ?? "",
        isActive: match.etat_administratif === "A"
      };
      setCompany(result);
    }).catch((err) => {
      if (err.name !== "AbortError") {
        setError("Erreur lors de la recherche SIRET");
        setCompany(null);
      }
    }).finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [siret]);
  return { company, isLoading, error };
}

// src/components/SiretInput/SiretInput.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function SiretInput({
  onFetch,
  onError,
  className,
  style,
  ...inputProps
}) {
  const [value, setValue] = useState5("");
  const cleaned = value.replace(/\s/g, "");
  const { company, isLoading, error } = useSiretLookup(cleaned);
  useEffect4(() => {
    if (company) onFetch?.(company);
  }, [company, onFetch]);
  useEffect4(() => {
    if (error) onError?.(error);
  }, [error, onError]);
  const formatSiret = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 14);
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 9));
    if (digits.length > 9) parts.push(digits.slice(9, 14));
    return parts.join(" ");
  };
  return /* @__PURE__ */ jsxs3("div", { style, className, children: [
    /* @__PURE__ */ jsx3(
      "input",
      {
        ...inputProps,
        type: "text",
        inputMode: "numeric",
        value,
        onChange: (e) => setValue(formatSiret(e.target.value)),
        "aria-busy": isLoading,
        "aria-invalid": error ? true : void 0
      }
    ),
    isLoading && /* @__PURE__ */ jsx3("span", { role: "status", "aria-live": "polite", children: "Recherche en cours..." })
  ] });
}

// src/components/IbanInput/IbanInput.tsx
import { useState as useState6, useCallback as useCallback3 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
function isValidIban(iban) {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) return false;
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  let numericStr = "";
  for (const char of rearranged) {
    if (char >= "A" && char <= "Z") {
      numericStr += (char.charCodeAt(0) - 55).toString();
    } else {
      numericStr += char;
    }
  }
  let remainder = 0;
  for (let i = 0; i < numericStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numericStr[i], 10)) % 97;
  }
  return remainder === 1;
}
function formatIban(raw) {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 34);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}
function IbanInput({
  onChange,
  className,
  style,
  ...inputProps
}) {
  const [value, setValue] = useState6("");
  const handleChange = useCallback3(
    (e) => {
      const formatted = formatIban(e.target.value);
      setValue(formatted);
      const raw2 = formatted.replace(/\s/g, "");
      onChange?.(raw2, isValidIban(raw2));
    },
    [onChange]
  );
  const raw = value.replace(/\s/g, "");
  const valid = raw.length > 0 ? isValidIban(raw) : void 0;
  return /* @__PURE__ */ jsx4(
    "input",
    {
      ...inputProps,
      type: "text",
      value,
      onChange: handleChange,
      className,
      style,
      "aria-invalid": valid === false ? true : void 0,
      autoComplete: "off",
      spellCheck: false
    }
  );
}

// src/components/PhoneInput/PhoneInput.tsx
import { useState as useState7, useCallback as useCallback4 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const groups = [];
  for (let i = 0; i < digits.length; i += 2) {
    groups.push(digits.slice(i, i + 2));
  }
  return groups.join(" ");
}
function isValidFrenchPhone(digits) {
  return /^0[1-9]\d{8}$/.test(digits);
}
function PhoneInput({
  onChange,
  className,
  style,
  ...inputProps
}) {
  const [value, setValue] = useState7("");
  const handleChange = useCallback4(
    (e) => {
      const formatted = formatPhone(e.target.value);
      setValue(formatted);
      const digits2 = formatted.replace(/\s/g, "");
      onChange?.(digits2, isValidFrenchPhone(digits2));
    },
    [onChange]
  );
  const digits = value.replace(/\s/g, "");
  const valid = digits.length > 0 ? isValidFrenchPhone(digits) : void 0;
  return /* @__PURE__ */ jsx5(
    "input",
    {
      ...inputProps,
      type: "tel",
      value,
      onChange: handleChange,
      className,
      style,
      "aria-invalid": valid === false ? true : void 0,
      autoComplete: "tel"
    }
  );
}
export {
  AddressInput,
  IbanInput,
  PhoneInput,
  PostalCodeInput,
  SiretInput,
  isValidSiretFormat,
  useAddressSearch,
  useSiretLookup
};
//# sourceMappingURL=index.mjs.map