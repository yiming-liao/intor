import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { MessagesReader } from "@/server/messages/shared/types";
import type { GenConfigKeys, GenMessages } from "@/shared/types/generated";
import type { Locale } from "intor-translator";

export type LoadMessagesOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  extraOptions?: {
    exts?: string[];
    messagesReader?: MessagesReader;
  };
  allowCacheWrite?: boolean;
};

export type LoadMessagesResult<CK extends GenConfigKeys = "__default__"> =
  Promise<GenMessages<CK> | undefined>;
