export { deepMerge } from "./deep-merge";
export { resolveLoaderOptions } from "./resolve-loader-options";
export { isExternalDestination } from "./is-external-destination";

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
