import type { KeyMode, TranslatorInstance } from "@/shared/types";
import { type Locale, type LocaleMessages } from "intor-translator";

export type TranslatorInstanceServer<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = TranslatorInstance<M, PK, Mode> & {
  /** `messages`: The message object containing all translations. */
  messages: M;

  /** Current locale in use. */
  locale: Locale<M>;
};
