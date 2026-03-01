import type { TagRenderers } from "../../../core";
import type { Rich } from "intor-translator";

/**
 * Mapping of semantic rich message tags to React renderers.
 *
 * Used by `tRich` to resolve rich content into `ReactNode` output.
 *
 * @public
 */
export type ReactTagRenderers<RichShape = Rich> = TagRenderers<
  React.ReactNode,
  RichShape
>;
