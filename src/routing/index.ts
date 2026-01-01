// pipeline
export { resolveRouting } from "./pipeline/resolve-routing";

// pathname
export { localizePathname, type LocalizedPathname } from "./pathname";

// locale
export {
  getLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "./locale";

export {
  resolveNavigationTarget,
  type NavigationTarget,
} from "./resolve-navigation-target";
