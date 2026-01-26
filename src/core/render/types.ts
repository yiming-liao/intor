import type { Rich } from "intor-translator";

/** Renderer function for a semantic rich tag. */
type TagRenderer<Output = string> = ((children: Output[]) => Output) | Output;

/** Core mapping of semantic rich tags to renderers. */
export type TagRenderers<Output = string, RichSchema = Rich> = {
  [K in keyof RichSchema]: TagRenderer<Output>;
} & Record<string, TagRenderer<Output>>;

/** Mapping of semantic rich tags to HTML string renderers. */
export type HtmlTagRenderers<RichSchema = Rich> = TagRenderers<
  string,
  RichSchema
>;
