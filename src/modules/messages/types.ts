import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import type {
  GenConfigKeys,
  GenMessages,
} from "@/shared/types/generated.types";
import type { Locale } from "intor-translator";

export type MessagesLoaderOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname: string;
};

export type MessagesLoaderResult<C extends GenConfigKeys = "__default__"> =
  Promise<GenMessages<C> | undefined>;
