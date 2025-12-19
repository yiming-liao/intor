export { deepMerge } from "./deep-merge";
export { normalizePathname } from "./normalize-pathname";
export { normalizeCacheKey } from "./normalize-cache-key";
export { resolveNamespaces } from "./resolve-namespaces";

// locale
export { normalizeLocale, resolveLocaleFromAcceptLanguage } from "./locale";

// routing
export {
  extractPathname,
  standardizePathname,
  localePrefixPathname,
  localizePathname,
} from "./routing";
