// inbound
export { resolveInbound, type InboundContext } from "./inbound";

// pathname
export { localizePathname, type LocalizedPathname } from "./pathname";

// locale
export {
  getLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "./locale";

export { resolveNavigation, type NavigationResult } from "./navigation";
