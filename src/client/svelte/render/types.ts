import type { Rich } from "intor-translator";

/** Renderer function for a semantic rich tag. */
type SvelteTagRenderer = ((children: string[]) => string) | string;

/** Mapping of semantic rich tags to Svelte renderers. */
export type SvelteTagRenderers<RichSchema = Rich> = {
  [K in keyof RichSchema]: SvelteTagRenderer;
} & Record<string, SvelteTagRenderer>;
