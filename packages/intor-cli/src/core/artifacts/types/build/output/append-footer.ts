import { indent } from "../utils/indent";

export function appendFooter(lines: string[]) {
  lines.push(`${indent(1)}}`, `}`, `export type __dummy = void;`);
}
