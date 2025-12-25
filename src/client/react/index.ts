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
export { useTranslator, T } from "./translator";

// navigation
export { useNavigationTarget, useNavigationStrategy } from "./navigation";

// helpers (client-shared utilities, re-exported)
export { getClientLocale } from "@/client/helpers";
