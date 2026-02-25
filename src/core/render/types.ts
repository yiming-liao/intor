import type { Rich } from "intor-translator";

/** Renderer function for a semantic rich tag. */
type TagRenderer<Output = string> = ((children: Output[]) => Output) | Output;

/** Core mapping of semantic rich tags to renderers. */
export type TagRenderers<Output = string, RichShape = Rich> = {
  [K in keyof RichShape]: TagRenderer<Output>;
} & Record<string, TagRenderer<Output>>;

/** Mapping of semantic rich tags to HTML string renderers. */
export type HtmlTagRenderers<RichShape = Rich> = TagRenderers<
  string,
  RichShape
>;
