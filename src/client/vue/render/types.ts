import type { Attributes } from "intor-translator";
import type { VNodeChild } from "vue";

/**
 * A renderer for a semantic tag in a rich message.
 */
type VueTagRenderer = (
  children: VNodeChild[],
  attributes: Attributes,
) => VNodeChild;

/**
 * A mapping of semantic tag names to Vue renderers.
 *
 * Each entry can be either:
 * - A render function that receives children and attributes
 * - A static VNodeChild, used as-is for the tag
 */
export type VueTagRenderers = Record<string, VueTagRenderer | VNodeChild>;
