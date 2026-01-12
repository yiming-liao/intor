import type { Rich } from "intor-translator";
import type { VNodeChild } from "vue";

/** Renderer function for a semantic rich tag. */
type VueTagRenderer = (children: VNodeChild[]) => VNodeChild | VNodeChild;

/** Mapping of semantic rich tags to Vue renderers. */
export type VueTagRenderers<RichSchema = Rich> = {
  [K in keyof RichSchema]: VueTagRenderer;
} & Record<string, VueTagRenderer>;
