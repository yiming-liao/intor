import type { Rich } from "intor-translator";

/**
 * Renderer for a semantic rich tag.
 *
 * @public
 */
export type TagRenderer<Output = string> =
  | ((children: Output[]) => Output)
  | Output;

/**
 * Mapping of semantic rich tags to renderers.
 *
 * @public
 */
export type TagRenderers<Output = string, RichShape = Rich> = {
  [K in keyof RichShape]: TagRenderer<Output>;
} & Record<string, TagRenderer<Output>>;

/**
 * HTML string-based rich tag renderers.
 *
 * @public
 */
export type HtmlTagRenderers<RichShape = Rich> = TagRenderers<
  string,
  RichShape
>;
