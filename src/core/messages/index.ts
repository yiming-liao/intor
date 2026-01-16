// load-remote-messages
export { loadRemoteMessages } from "./load-remote-messages";

// messages pool
export {
  type MessagesPool,
  getGlobalMessagesPool,
  clearMessagesPool,
} from "./global-messages-pool";

// merge-messages
export { mergeMessages } from "./merge-messages";

// utils
export { isValidMessages } from "./utils/is-valid-messages";

// types
export type { MessagesReader, MessagesReaders } from "./types";

// internal-metadata
export {
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
  getMessagesKind,
  type IntorMessagesKind,
} from "./internal-metadata";
