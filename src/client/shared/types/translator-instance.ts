import type { TranslatorInstance, KeyMode } from "@/shared/types";
import { type Locale, type LocaleMessages } from "intor-translator";

/**
 * Client-side translator instance.
 */
export type TranslatorInstanceClient<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = TranslatorInstance<M, PK, Mode> & {
  /** Indicates whether translations are currently loading. */
  isLoading: boolean;

  /** Update the active locale on the client. */
  setLocale: (locale: Locale<M>) => void;
};
