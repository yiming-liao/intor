import type { IntorResolvedConfig } from "@/config";
import type { MessagesReader } from "@/core";
import type { Locale } from "intor-translator";

export type LoadMessagesParams = {
  config: IntorResolvedConfig;
  locale: Locale;
  extraOptions?: {
    exts?: string[];
    messagesReader?: MessagesReader;
  };

  /**
   * Controls whether this load operation is allowed to write into
   * the shared messages cache.
   *
   * This is intended for internal orchestration (e.g. `intor`)
   * to act as the primary cache writer, while other helpers
   * may perform read-only loads.
   */
  allowCacheWrite?: boolean;
};
