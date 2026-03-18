import { indent } from "../utils/indent";

export const INTOR_GENERATED_KEY = "__intor_generated__";

export function appendHeader(lines: string[], interfaceName: string) {
  lines.push(
    `declare global {`,
    `${indent(1)}interface ${interfaceName} {`,
    `${indent(2)}${INTOR_GENERATED_KEY}: true;`,
  );
}
