// intor (core)

// core
export {
  // constants
  PREFIX_PLACEHOLDER,
  // error
  IntorError,
  IntorErrorCode,
  // utils
  deepMerge,
  resolveLoaderOptions,
  // logger
  clearLoggerPool,
  // messages
  clearMessagesPool,
  setGlobalMessagesPool,
  mergeMessages,
  isValidMessages,
  type Messages,
  type MessagesReader,
} from "@/core";

// config
export {
  defineIntorConfig,
  // types
  type IntorRawConfig,
  type IntorResolvedConfig,
} from "@/config";

// routing
export { localizePathname } from "@/routing";

// --- [dependency] intor-translator
export {
  Translator,
  // plugin
  type TranslatorPlugin,
  // translate config & handlers
  type TranslateHandlers,
  type FormatHandler,
  type LoadingHandler,
  type MissingHandler,
  type HandlerContext,
  // pipeline
  type TranslateContext,
  type TranslateHook,
  // messages
  type LocaleMessages,
} from "intor-translator";
