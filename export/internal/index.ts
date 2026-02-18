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
} from "@/core";

export { loadMessages } from "@/server";

export type {
  // generated
  GenConfigKeys,
  GenConfig,

  // translator-instance
  TranslatorInstance,
} from "@/core";

export type { TranslatorInstanceReact } from "@/client/react/translator/translator-instance";
