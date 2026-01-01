import type { IntorResolvedConfig } from "@/config";
import type { MessagesReadOptions } from "@/core";
import type { Locale } from "intor-translator";

export type LoadMessagesParams = {
  config: IntorResolvedConfig;
  locale: Locale;
  readOptions?: MessagesReadOptions;

  /**
   * Controls whether this load operation is permitted to
   * write into the shared messages cache.
   */
  allowCacheWrite?: boolean;
};
