import type { TagRenderers } from "../../../core";
import type { Rich } from "intor-translator";
import type { VNodeChild } from "vue";

/**
 * Mapping of semantic rich message tags to Vue renderers.
 *
 * Used by `tRich` to resolve rich content into `VNodeChild` output.
 *
 * @public
 */
export type VueTagRenderers<RichShape = Rich> = TagRenderers<
  VNodeChild,
  RichShape
>;
