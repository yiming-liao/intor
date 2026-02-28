// intor (core)

export * from "./types";

//--------------------------------------------------------------
// core
//--------------------------------------------------------------
export {
  // error
  IntorError,
  INTOR_ERROR_CODE,

  // locale,
  matchLocale,

  // messages (merge-messages)
  mergeMessages,
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

  // helper
  resolveInboundFromRequest,
} from "../src/routing";

//--------------------------------------------------------------
// client
//--------------------------------------------------------------
export { getClientLocale } from "../src/client";
