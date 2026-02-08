// inbound
export {
  resolveInbound,
  type InboundResult,
  type InboundContext,
  resolveInboundFromRequest,
} from "./inbound";

// pathname
export { localizePathname, type LocalizedPathname } from "./pathname";

// locale
export {
  getLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  getLocaleFromHost,
  getLocaleFromQuery,
} from "./locale";

export { resolveOutbound, type OutboundResult } from "./outbound";
