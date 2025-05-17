// Define condfig
export { defineIntorConfig } from "./core/intor-config";

// Main entry
export { intor } from "./core/intor";

// Intor error
export { IntorError, IntorErrorCode } from "./core/intor-error";

// Intor logger
export {
  IntorLogger,
  getOrCreateLogger,
  resetLoggerFactory,
} from "./core/intor-logger";

// Messages loader
export {
  loadLocalMessages,
  fetchApiMessages,
} from "./core/intor-messages-loader";
export type { FetchApiMessagesOptions } from "./core/intor-messages-loader";

// Intor translator
export { intorTranslator } from "./core/intor-translator";
export type { Translator } from "./core/intor-translator";
export type {
  MessageFormatter,
  LoadingMessageHandler,
  PlaceholderHandler,
} from "./core/intor-translator";
