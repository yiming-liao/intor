import type {
  LocaleKey,
  Replacement,
  RichReplacement,
  ScopedLeafKeys,
  NodeKeys,
  UnionLocaleMessages,
  InferTranslatorKey,
} from "intor-translator";
import { IfGen } from "@/shared/types/generated.types";

export type NodeKey<M> = NodeKeys<UnionLocaleMessages<M>> & string;

// Shared
export interface SharedProps<M> {
  messages: M;
  locale: LocaleKey<M>;
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
} & SharedProps<M>;

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
} & SharedProps<M>;
