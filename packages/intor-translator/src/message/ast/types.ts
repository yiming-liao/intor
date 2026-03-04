import type { MessageValue } from "../../types";
import type { Attributes } from "../types";

/**
 * Semantic node produced by the rich message parser.
 *
 * Represents a unit in the renderer-agnostic AST.
 *
 * @public
 */
export type ASTNode = TextNode | TagNode | RawNode;

/**
 * Plain text node in the semantic AST.
 *
 * @public
 */
export interface TextNode {
  type: "text";
  value: string;
}

/**
 * Semantic tag node with attributes and nested children.
 *
 * @public
 */
export interface TagNode {
  type: "tag";
  name: string;
  attributes: Attributes;
  children: ASTNode[];
}

/**
 * Raw node representing a non-tokenizable message value.
 *
 * @public
 */
export interface RawNode {
  type: "raw";
  value: Exclude<MessageValue, string>;
}
