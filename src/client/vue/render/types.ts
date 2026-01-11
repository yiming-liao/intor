import type { Attributes, Rich } from "intor-translator";
import type { VNodeChild } from "vue";

/**
 * A renderer for a semantic tag in a rich message.
 *
 * - `children` are the rendered inner nodes of the tag
 * - `attributes` include both schema-defined and runtime attributes
 */
type VueTagRenderer<A = Attributes> = (
  children: VNodeChild[],
  attributes: A & Attributes,
) => VNodeChild;

/**
 * A mapping of semantic tag names to Vue renderers.
 *
 * - Known tags are strongly typed based on the generated rich schema
 * - Unknown tags fall back to a generic renderer signature
 *
 * This design ensures:
 * - Accurate autocompletion for generated tags
 * - Fail-soft behavior for dynamic or newly added tags
 */
export type VueTagRenderers<RichSchema = Rich> = {
  [K in keyof RichSchema]: VueTagRenderer<RichSchema[K]>;
} & Record<string, VueTagRenderer>;
