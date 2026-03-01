// intor (core)

export * from "./shared-types";

//--------------------------------------------------------------
// core
//--------------------------------------------------------------
export {
  // error
  type IntorErrorOptions,
  IntorError,
  INTOR_ERROR_CODE,
  type IntorErrorCode,

  // locale,
  matchLocale,

  // messages (merge-messages)
  mergeMessages,
  type MergeMessagesOptions,
  type MergeMessagesEvent,
} from "../src/core";

//--------------------------------------------------------------
// config
//--------------------------------------------------------------
export { defineIntorConfig } from "../src/config";

//--------------------------------------------------------------
// routing
//--------------------------------------------------------------
export {
  // pathname
  localizePathname,
  type LocalizedPathname,

  // inbound
  type InboundResult,
  type InboundContext,

  // helper
  resolveInboundFromRequest,
} from "../src/routing";

//--------------------------------------------------------------
// client
//--------------------------------------------------------------
export { getClientLocale } from "../src/client";

//--------------------------------------------------------------
// intor-translator
//--------------------------------------------------------------
export type {
  Translator,

  // translation pipeline
  TranslateContext,
  TranslateHook,
  TranslateHandlers,
  HandlerContext,
  FormatHandler,
  LoadingHandler,
  MissingHandler,

  // types
  LocaleMessages,
  MessageObject,
  MessageValue,
} from "intor-translator";
