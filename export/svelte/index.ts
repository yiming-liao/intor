// intor / svelte

export {
  // provider
  createIntorStore, // @internal
  type IntorProviderProps,
  useIntorContext, // @internal

  // translator
  useTranslator,

  // helpers
  getClientLocale,
} from "@/client/svelte";

// Re-bind the Svelte component with an explicit type so tsc can generate
// correct .d.ts output for the public API.
import type { IntorProviderProps } from "@/client/svelte";
import type { Component } from "svelte";
import { IntorProvider as IntorProviderComponent } from "@/client/svelte";

export const IntorProvider: Component<IntorProviderProps> =
  IntorProviderComponent;
