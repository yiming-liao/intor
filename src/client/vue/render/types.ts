import type { TagRenderers } from "@/core";
import type { Rich } from "intor-translator";
import type { VNodeChild } from "vue";

/** Mapping of semantic rich tags to Vue renderers. */
export type VueTagRenderers<RichSchema = Rich> = TagRenderers<
  VNodeChild,
  RichSchema
>;
