// contexts
export {
  IntorProvider,
  type IntorProviderProps,
  useConfig,
  useLocale,
  useMessages,
  TranslatorRuntimeProvider,
  type TranslatorRuntimeProviderProps,
} from "./contexts";

// translator
export { useTranslator } from "./translator/use-translator";

// navigation
export { useNavigationTarget, useNavigationStrategy } from "./navigation";

// helpers (client-shared utilities, re-exported)
export { getClientLocale } from "@/client/helpers";
