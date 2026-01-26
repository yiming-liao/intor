import type { TagRenderers } from "@/core";
import type { Rich } from "intor-translator";

/** Mapping of semantic rich tags to React renderers. */
export type ReactTagRenderers<RichSchema = Rich> = TagRenderers<
  React.ReactNode,
  RichSchema
>;
