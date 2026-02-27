// intor / svelte

export {
  // provider
  createIntorStore,
  type IntorProviderProps,
  getIntorContext, // @internal

  // translator
  useTranslator,
} from "../../src/client/svelte";

// Re-bind the Svelte component with an explicit type so tsc can generate
// correct .d.ts output for the public API.
import type { IntorProviderProps } from "../../src/client/svelte";
import type { Component } from "svelte";
import { IntorProvider as IntorProviderComponent } from "../../src/client/svelte";

export const IntorProvider: Component<IntorProviderProps> =
  IntorProviderComponent;
