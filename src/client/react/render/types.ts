import type { Rich } from "intor-translator";

/** Renderer function for a semantic rich tag. */
type ReactTagRenderer =
  | ((children: React.ReactNode[]) => React.ReactNode)
  | React.ReactNode;

/** Mapping of semantic rich tags to React renderers. */
export type ReactTagRenderers<RichSchema = Rich> = {
  [K in keyof RichSchema]: ReactTagRenderer;
} & Record<string, ReactTagRenderer>;
