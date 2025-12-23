// intor

// constants
export { PREFIX_PLACEHOLDER } from "@/shared/constants";

// shared / utils
export {
  // pathname
  localizePathname,
} from "@/shared/utils";

// shared / error
export { IntorError, IntorErrorCode } from "@/shared/error";

// --- [dependency] intor-translator
export {
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
