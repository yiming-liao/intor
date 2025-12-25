// intor / react

export {
  // contexts
  IntorProvider,
  type IntorProviderProps,
  TranslatorRuntimeProvider,
  type TranslatorRuntimeProviderProps,
  // Internal context hooks.  (useConfig, useLocale)
  // Intentionally exported for cross-adapter usage
  useConfig,
  useLocale,

  // translator
  useTranslator,

  // helpers
  getClientLocale,
} from "@/client/react";
