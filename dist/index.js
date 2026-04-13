"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AddressInput: () => AddressInput,
  IbanInput: () => IbanInput,
  PhoneInput: () => PhoneInput,
  PostalCodeInput: () => PostalCodeInput,
  SiretInput: () => SiretInput,
  isValidSiretFormat: () => isValidSiretFormat,
  useAddressSearch: () => useAddressSearch,
  useSiretLookup: () => useSiretLookup
});
module.exports = __toCommonJS(index_exports);

// src/components/AddressInput/AddressInput.tsx
var import_react2 = require("react");

// src/components/AddressInput/useAddressSearch.ts
var import_react = require("react");

// src/constants.ts
var ADDRESS_API_URL = "https://api-adresse.data.gouv.fr/search";
var ENTREPRISE_API_URL = "https://recherche-entreprises.api.gouv.fr/search";

// src/components/AddressInput/useAddressSearch.ts
function useAddressSearch(query, debounceMs = 300) {
  const [results, setResults] = (0, import_react.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react.useState)(false);
  const abortRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
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
var import_jsx_runtime = require("react/jsx-runtime");
function AddressInput({
  onSelect,
  debounceMs = 300,
  className,
  style,
  ...inputProps
}) {
  const [query, setQuery] = (0, import_react2.useState)("");
  const [isOpen, setIsOpen] = (0, import_react2.useState)(false);
  const [activeIndex, setActiveIndex] = (0, import_react2.useState)(-1);
  const { results, isLoading } = useAddressSearch(query, debounceMs);
  const listRef = (0, import_react2.useRef)(null);
  const selectAddress = (0, import_react2.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "relative", ...style }, className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    isOpen && results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        children: results.map((address, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_react3 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function PostalCodeInput({
  onSelect,
  className,
  style,
  ...inputProps
}) {
  const [value, setValue] = (0, import_react3.useState)("");
  const [cities, setCities] = (0, import_react3.useState)([]);
  const [isOpen, setIsOpen] = (0, import_react3.useState)(false);
  const [activeIndex, setActiveIndex] = (0, import_react3.useState)(-1);
  const abortRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
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
  const selectCity = (0, import_react3.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative", ...style }, className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
    isOpen && cities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
        ) : cities.map((city, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
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
var import_react5 = require("react");

// src/components/SiretInput/useSiretLookup.ts
var import_react4 = require("react");
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
  const [company, setCompany] = (0, import_react4.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  const abortRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
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
var import_jsx_runtime3 = require("react/jsx-runtime");
function SiretInput({
  onFetch,
  onError,
  className,
  style,
  ...inputProps
}) {
  const [value, setValue] = (0, import_react5.useState)("");
  const cleaned = value.replace(/\s/g, "");
  const { company, isLoading, error } = useSiretLookup(cleaned);
  (0, import_react5.useEffect)(() => {
    if (company) onFetch?.(company);
  }, [company, onFetch]);
  (0, import_react5.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style, className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
    isLoading && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { role: "status", "aria-live": "polite", children: "Recherche en cours..." })
  ] });
}

// src/components/IbanInput/IbanInput.tsx
var import_react6 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  const [value, setValue] = (0, import_react6.useState)("");
  const handleChange = (0, import_react6.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_react7 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
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
  const [value, setValue] = (0, import_react7.useState)("");
  const handleChange = (0, import_react7.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddressInput,
  IbanInput,
  PhoneInput,
  PostalCodeInput,
  SiretInput,
  isValidSiretFormat,
  useAddressSearch,
  useSiretLookup
});
//# sourceMappingURL=index.js.map