"use client";

import {
  PreKey,
  ScopedTranslatorMethods,
  SharedMethod,
  TranslatorMethods,
} from "./types";
import { useLocale } from "@/adapters/next/contexts/locale";
import { useTranslator } from "@/adapters/next/contexts/translator";

type IntorMessages = void;

// Signature: Without preKey
export function useIntor<M = IntorMessages>(): TranslatorMethods<M>;

// Signature: With preKey
export function useIntor<M = IntorMessages, K extends PreKey<M> = PreKey<M>>(
  preKey: M extends void ? string : K,
): ScopedTranslatorMethods<M, K>;

// Implementation
export function useIntor<M = IntorMessages, K extends PreKey<M> = PreKey<M>>(
  preKey?: K,
) {
  const { translator } = useTranslator<M>();
  const { setLocale } = useLocale();
  const sharedMethod: SharedMethod<M> = {
    messages: translator.messages as M,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
  };
  if (preKey) {
    const { hasKey, t } = translator.scoped(preKey);
    return { ...sharedMethod, hasKey, t };
  } else {
    const { hasKey, t } = translator;
    return { ...sharedMethod, hasKey, t };
  }
}
