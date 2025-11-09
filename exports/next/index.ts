//====== Contexts ======
export { useConfig } from "@/adapters/next/contexts/config";
export { useLocale } from "@/adapters/next/contexts/locale";
export { useMessages } from "@/adapters/next/contexts/messages";
export { useTranslator } from "@/adapters/next/contexts/translator";
// Custom handlers
export { TranslateHandlersProvider } from "@/adapters/next/contexts/translate-handlers";
export type { TranslateHandlersProviderProps } from "@/adapters/next/contexts/translate-handlers";

//====== Providers ======
export { IntorProvider } from "@/adapters/next/providers/intor-provider";
export type { IntorProviderProps } from "@/adapters/next/providers/intor-provider";
export { useIntor } from "@/adapters/next/providers/use-intor";

//====== Tools ======
export { Link } from "@/adapters/next/tools/Link";
export { usePathname } from "@/adapters/next/tools/usePathname";
export { useRouter } from "@/adapters/next/tools/useRouter";
