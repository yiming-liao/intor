"use client";

import type {
  LocaleKey,
  Replacement,
  RichReplacement,
  ScopedLeafKeys,
  NodeKeys,
  UnionLocaleMessages,
} from "intor-translator";
import { ScopedTranslatorMethods, TranslatorMethods } from "./types";
import { useIntorLocale } from "@/adapters/next-client/contexts/intor-locale";
import { useIntorTranslator } from "@/adapters/next-client/contexts/intor-translator";

// Shared
type Shared<M> = {
  messages: M;
  locale: LocaleKey<M>;
  isLoading: boolean;
  setLocale: (locale: LocaleKey<M>) => void;
};

// Overload implementation: with preKey
function useIntorWithPreKey<M, K extends string>(
  preKey: K,
): ScopedTranslatorMethods<M, K> & Shared<M> {
  const { translator } = useIntorTranslator<M>();
  const { setLocale } = useIntorLocale();
  const scoped = translator.scoped(
    preKey as unknown as NodeKeys<UnionLocaleMessages<M>>,
  );
  return {
    messages: translator.messages as M,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
    hasKey: scoped.hasKey as (
      key?: M extends unknown ? string : ScopedLeafKeys<M, K> & string,
      targetLocale?: LocaleKey<M>,
    ) => boolean,
    t: scoped.t as (
      key?: M extends unknown ? string : ScopedLeafKeys<M, K> & string,
      replacements?: Replacement | RichReplacement,
    ) => string,
  };
}

// Overload implementation: without preKey
function useIntorWithoutPreKey<M>(): TranslatorMethods<M> & Shared<M> {
  const { translator } = useIntorTranslator<M>();
  const { setLocale } = useIntorLocale();
  const scoped = translator.scoped();
  return {
    messages: translator.messages as M,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
    hasKey: scoped.hasKey,
    t: scoped.t,
  };
}

// Overload signature: without preKey
export function useIntor<M>(): TranslatorMethods<M> & Shared<M>;

// Overload signature: with preKey
export function useIntor<M, K extends string>(
  preKey: K,
): ScopedTranslatorMethods<M, K> & Shared<M>;

// Overload implementation: unified entry point
export function useIntor<M, K extends string>(preKey?: K) {
  if (preKey) {
    return useIntorWithPreKey<M, K>(preKey);
  }
  return useIntorWithoutPreKey<M>();
}
