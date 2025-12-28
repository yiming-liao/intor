import type { ReactTagRenderers } from "@/client/react/render";
import type { KeyMode, MessageKey, TranslatorInstance } from "@/core/types";
import type { JSX } from "react/jsx-runtime";
import {
  type Locale,
  type LocaleMessages,
  type Replacement,
} from "intor-translator";

export type TranslatorInstanceReact<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = TranslatorInstance<M, PK, Mode> & {
  /** `messages`: The message object containing all translations. */
  messages: M;

  /** Current locale in use. */
  locale: Locale<M>;

  /** Indicates whether translations are currently loading. */
  isLoading: boolean;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Translate a key into React nodes using semantic tags */
  tRich: (
    key?: MessageKey<M, PK, Mode>,
    tagRenderers?: ReactTagRenderers,
    replacements?: Replacement,
  ) => JSX.Element[];
};
