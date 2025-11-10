import type {
  LocaleKey,
  Replacement,
  RichReplacement,
  ScopedLeafKeys,
  InferTranslatorKey,
  NodeKeys,
  UnionLocaleMessages,
} from "intor-translator";

export type PreKey<M> = NodeKeys<UnionLocaleMessages<M>> & string;

// Shared
export interface SharedMethod<M> {
  messages: M;
  locale: LocaleKey<M>;
  isLoading: boolean;
  setLocale: (locale: LocaleKey<M>) => void;
}

// Non-scoped
export type TranslatorMethods<M> = {
  hasKey: (
    key?: InferTranslatorKey<M> & string,
    targetLocale?: LocaleKey<M>,
  ) => boolean;
  t: (
    key?: InferTranslatorKey<M> & string,
    replacements?: Replacement | RichReplacement,
  ) => string;
} & SharedMethod<M>;

// Scoped
export type ScopedTranslatorMethods<M, K extends string> = {
  hasKey: (
    key?: M extends void ? string : ScopedLeafKeys<M, K> & string,
    targetLocale?: LocaleKey<M>,
  ) => boolean;
  t: (
    key?: M extends void ? string : ScopedLeafKeys<M, K> & string,
    replacements?: Replacement | RichReplacement,
  ) => string;
} & SharedMethod<M>;
