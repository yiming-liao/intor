// contexts
export {
  IntorProvider,
  type IntorProviderProps,
} from "./contexts/intor-provider";
export {
  TranslatorRuntimeProvider,
  type TranslatorRuntimeProviderProps,
} from "./contexts/translator-runtime";

// translator
export { useTranslator } from "./translator/use-translator";

// helpers
export { getClientLocale } from "@/client/helpers";
