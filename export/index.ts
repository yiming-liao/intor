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
  type DeepMergeOverrideEvent,
  resolveLoaderOptions,
  // logger
  clearLoggerPool,
  mergeMessages,
  isValidMessages,
  type MessagesReader,
  type MessagesReaders,
  // Gen types
  type GenLocale as Locale,
  // internal-metadata
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
  getMessagesKind,
  type IntorMessagesKind,
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
