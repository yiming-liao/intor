import type { IfGen } from "@/shared/types/generated.types";
import {
  type Locale,
  type Replacement,
  type ScopedLeafKeys,
  type LocalizedLeafKeys,
  type LocaleMessages,
} from "intor-translator";

/** Base properties shared by all translator instances. */
export interface TranslatorBaseProps<M = unknown> {
  /** `messages`: The message object containing all translations. */
  messages: M;
  /** Current locale in use. */
  locale: Locale<M>;
}

/** Properties specific to client-side translator behavior. */
export interface TranslatorClientProps<M = unknown> {
  /** `isLoading`: Indicates whether translations are currently loading. */
  isLoading: boolean;
  /** `setLocale`: Function to update the current locale. */
  setLocale: (locale: Locale<M>) => void;
}

/**
 * Conditional key type for TranslatorInstance.
 * - Resolves to `ScopedLeafKeys` if a pre-key `PK` is provided,
 * otherwise resolves to `LocalizedLeafKeys`.
 */
type Key<M extends LocaleMessages, PK> = IfGen<
  PK extends string ? ScopedLeafKeys<M, PK> : LocalizedLeafKeys<M>,
  string
>;

/**
 * Translator instance type.
 * Combines base props, client props, and core translation methods.
 */
export type TranslatorInstance<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
> = {
  /** Check if a given key exists in the messages. */
  hasKey: (key?: Key<M, PK>, targetLocale?: Locale<M>) => boolean;

  /** Translate a given key into its string representation. */
  t: <Result = string>(key?: Key<M, PK>, replacements?: Replacement) => Result;
} & TranslatorBaseProps<M> &
  TranslatorClientProps<M>;
