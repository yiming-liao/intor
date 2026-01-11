import type { Attributes, Rich } from "intor-translator";

/**
 * Renderer function for a semantic rich tag.
 *
 * - `children` are the rendered inner nodes of the tag
 * - `attributes` include both schema-defined and runtime attributes
 */
type ReactTagRenderer<A = Attributes> = (
  children: React.ReactNode[],
  attributes: A & Attributes,
) => React.ReactNode;

/**
 * Mapping of rich tags to React renderers.
 *
 * - Known tags are strongly typed based on the generated rich schema
 * - Unknown tags fall back to a generic renderer signature
 *
 * This design ensures:
 * - Accurate autocompletion for generated tags
 * - Fail-soft behavior for dynamic or newly added tags
 */
export type ReactTagRenderers<RichSchema = Rich> = {
  [K in keyof RichSchema]: ReactTagRenderer<RichSchema[K]>;
} & Record<string, ReactTagRenderer>;
