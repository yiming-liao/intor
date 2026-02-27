// load-remote-messages
export { loadRemoteMessages } from "./load-remote-messages";

// merge-messages
export { mergeMessages, type MergeMessagesEvent } from "./merge-messages";

// utils
export { isValidMessages, nestObjectFromPath } from "./utils";

// types
export type { MessagesReader, MessagesReaders } from "./types";

// internal-metadata
export {
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
} from "./internal-metadata";
