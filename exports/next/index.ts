// --- Adapter: next-client
// Contexts
export {
  useIntorConfig,
  IntorConfigProvider,
} from "@/adapters/next-client/contexts/intor-config";
export {
  useIntorLocale,
  IntorLocaleProvider,
} from "@/adapters/next-client/contexts/intor-locale";
export {
  useIntorMessages,
  IntorMessagesProvider,
} from "@/adapters/next-client/contexts/intor-messages";
export {
  useIntorTranslator,
  IntorTranslatorProvider,
} from "@/adapters/next-client/contexts/intor-translator";

export type { IntorProviderProps } from "@/adapters/next-client/contexts/intor-provider-types";

export { TranslateHandlersContext } from "@/adapters/next-client/contexts/translate-handlers";
export type { TranslateHandlersProviderProps } from "@/adapters/next-client/contexts/translate-handlers/types";

// Hooks
export { useIntor } from "@/adapters/next-client/hooks/use-intor/use-intor";

// Tools
export { Link } from "@/adapters/next-client/tools/Link";
export { usePathname } from "@/adapters/next-client/tools/usePathname";
export { useRouter } from "@/adapters/next-client/tools/useRouter";
