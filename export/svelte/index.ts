// intor / svelte

export {
  // provider
  createIntorStore, // @internal
  IntorProvider,
  type IntorProviderProps,
  useIntorContext, // @internal

  // translator
  useTranslator,

  // helpers
  getClientLocale,
} from "@/client/svelte";
