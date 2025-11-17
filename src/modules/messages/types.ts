import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import type { MessageFileReader } from "@/modules/messages/shared/types";
import type {
  GenConfigKeys,
  GenMessages,
} from "@/shared/types/generated.types";
import type { Locale } from "intor-translator";

export type LoadMessagesOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname?: string;
  extraOptions?: {
    exts?: string[];
    messageFileReader?: MessageFileReader;
  };
};

export type LoadMessagesResult<C extends GenConfigKeys = "__default__"> =
  Promise<GenMessages<C> | undefined>;
