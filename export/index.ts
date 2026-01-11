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
  mergeMessages,
  isValidMessages,
  type MessagesReader,
  type MessagesReaders,
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
  // translation pipeline
  type TranslateContext,
  type TranslateHook,
  type TranslateHandlers,
  type HandlerContext,
  type FormatHandler,
  type LoadingHandler,
  type MissingHandler,
  // types
  type LocaleMessages,
  type MessageObject,
  type MessageValue,
  // messages (post-translation)
  tokenize,
  type Token,
} from "intor-translator";
