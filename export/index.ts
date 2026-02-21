// intor (core)

// core
export {
  // constants
  LOCALE_PLACEHOLDER,

  // error
  IntorError,
  IntorErrorCode,

  // locale,
  matchLocale,

  // logger
  clearLoggerPool,

  // messages
  mergeMessages,
  type MessagesReader,
  type MessagesReaders,

  // types
  type GenLocale as Locale,
} from "@/core";

// config
export {
  defineIntorConfig,

  // types
  type IntorRawConfig,
  type IntorResolvedConfig,
} from "@/config";

// routing
export { localizePathname, type InboundContext } from "@/routing";
