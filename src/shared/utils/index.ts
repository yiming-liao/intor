export { deepMerge } from "./deep-merge";

// normalizers
export {
  normalizeCacheKey,
  normalizeLocale,
  normalizePathname,
} from "./normalizers";

// locale
export {
  getLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "./locale";

// pathname
export { localizePathname } from "./pathname";
