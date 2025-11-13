import { Locale } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { GenConfigKeys, GenMessages } from "@/shared/types/generated.types";

export type MessagesLoaderOptions = {
  config: IntorResolvedConfig;
  locale: Locale;
  pathname: string;
};

export type MessagesLoaderResult<C extends GenConfigKeys = "__default__"> =
  Promise<GenMessages<C> | undefined>;
