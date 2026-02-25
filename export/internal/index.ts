// internal

/**
 *  NOTE: It is not part of the public stable contract and may change without notice.
 */

export {
  // utils
  resolveLoaderOptions,
  type DeepMergeOverrideEvent,

  // internal-metadata
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
  getMessagesKind,
  type IntorMessagesKind,
} from "../../src/core";

export { loadMessages } from "../../src/server";

export type {
  // generated
  GenConfigKeys,
  GenConfig,

  // translator-instance
  TranslatorInstance,
} from "../../src/core";

export type { TranslatorInstanceReact } from "../../src/client/react/translator/translator-instance";
