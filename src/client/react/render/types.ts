import type { Attributes } from "intor-translator";

/**
 * A renderer for a semantic tag in a rich message.
 */
type ReactTagRenderer = (
  children: React.ReactNode[],
  attributes: Attributes,
) => React.ReactNode;

/**
 * A mapping of semantic tag names to React renderers.
 *
 * Each entry can be either:
 * - A render function that receives children and attributes
 * - A static React node, used as-is for the tag
 *
 * This map allows customizing how semantic tags are rendered
 * when using rich messages in React.
 */
export type ReactTagRenderers = Record<
  string,
  ReactTagRenderer | React.ReactNode
>;
