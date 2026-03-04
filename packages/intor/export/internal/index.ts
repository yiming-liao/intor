// internal

/**
 *  NOTE: It is not part of the public stable contract and may change without notice.
 */

export {
  // utils
  resolveLoaderOptions,

  // internal-metadata
  INTOR_PREFIX,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_MESSAGES_KIND,
} from "../../src/core";

export { loadMessages } from "../../src/server";

export type {
  // generated
  GenConfigKeys,
  GenConfig,

  // translator-instance
  BaseTranslator,
} from "../../src/core";

export type { ReactTranslator } from "../../src/client/react/translator/types";
export type { VueTranslator } from "../../src/client/vue/translator/types";
export type { SvelteTranslator } from "../../src/client/svelte/translator/types";
