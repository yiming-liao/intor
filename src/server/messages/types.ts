import type { IntorResolvedConfig } from "@/config";
import type { MessagesReaders } from "@/core";
import type { Locale } from "intor-translator";

export type LoadMessagesParams = {
  config: IntorResolvedConfig;
  locale: Locale;
  readers?: MessagesReaders;

  /**
   * Controls whether this load operation is permitted to
   * write into the shared messages cache.
   */
  allowCacheWrite?: boolean;
};
