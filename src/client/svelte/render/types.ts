import type { Attributes } from "intor-translator";

/**
 * A renderer for a semantic tag in a rich message.
 */
type SvelteTagRenderer = (children: string[], attributes: Attributes) => string;

/**
 * A mapping of semantic tag names to Svelte renderers.
 *
 * Each entry can be either:
 * - A render function that receives children and attributes
 * - A static HTML string, used as-is for the tag
 */
export type SvelteTagRenderers = Record<string, SvelteTagRenderer | string>;
