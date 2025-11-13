import {
  type LocaleKey,
  type Replacement,
  type RichReplacement,
  type ScopedLeafKeys,
  type NodeKeys,
  type UnionLocaleMessages,
  type InferTranslatorKey,
} from "intor-translator";
import {
  GenConfigKeys,
  GenMessages,
  IfGen,
} from "@/shared/types/generated.types";

// PreKey
export type PreKey<C extends GenConfigKeys = "__default__"> = NodeKeys<
  UnionLocaleMessages<GenMessages<C>>
>;

// Base props
export interface TranslatorBaseProps<M> {
  messages: M;
  locale: LocaleKey<M>;
}

// Client props
export interface TranslatorClientProps<M> {
  isLoading: boolean;
  setLocale: (locale: LocaleKey<M>) => void;
}

// Non-scoped
export type TranslatorInstance<M> = {
  hasKey: (
    key?: IfGen<InferTranslatorKey<M>, string>,
    targetLocale?: LocaleKey<M> | undefined,
  ) => boolean;
  t: <Result = string>(
    key?: IfGen<InferTranslatorKey<M>, string>,
    replacements?: Replacement | RichReplacement,
  ) => Result;
} & TranslatorBaseProps<M> &
  TranslatorClientProps<M>;

// Scoped
export type ScopedTranslatorInstance<M, K extends string> = {
  hasKey: (
    key?: IfGen<ScopedLeafKeys<M, K> & string, string>,
    targetLocale?: LocaleKey<M>,
  ) => boolean;
  t: (
    key?: IfGen<ScopedLeafKeys<M, K> & string, string>,
    replacements?: Replacement | RichReplacement,
  ) => string;
} & TranslatorBaseProps<M> &
  TranslatorClientProps<M>;
