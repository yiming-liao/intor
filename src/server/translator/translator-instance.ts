import type { TranslatorInstance } from "@/core";
import { type Locale, type LocaleMessages } from "intor-translator";

export type TranslatorInstanceServer<
  M extends LocaleMessages,
  ReplacementSchema = unknown,
  PK extends string | undefined = undefined,
> = TranslatorInstance<M, ReplacementSchema, PK> & {
  /** `messages`: The message object containing all translations. */
  messages: M;

  /** Current locale in use. */
  locale: Locale<M>;
};
