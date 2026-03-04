import type { Attributes } from "../types";

/** Flat semantic token produced by the message tokenizer. */
export type Token = TextToken | TagOpenToken | TagCloseToken;

/** Plain text segment in the message. */
export interface TextToken {
  type: "text";
  value: string;
  position: number;
}

/** Opening semantic tag with parsed attributes. */
export interface TagOpenToken {
  type: "tag-open";
  name: string;
  attributes: Attributes;
  position: number;
}

/** Closing semantic tag (no attributes). */
export interface TagCloseToken {
  type: "tag-close";
  name: string;
  position: number;
}
