import { LOCALE_PLACEHOLDER } from "intor";
import { indent } from "./utils/indent";

// Wrap a type block under the locale placeholder key.
function wrapWithLocale(type: string) {
  return `{${indent(4)}"${LOCALE_PLACEHOLDER}": ${type};${indent(3)}}`;
}

// Append one config section to the generated global interface.
export function appendConfigBlock(
  lines: string[],
  {
    id,
    locales,
    messages,
    replacements,
    rich,
  }: {
    id: string;
    locales: string;
    messages: string;
    replacements: string;
    rich: string;
  },
) {
  lines.push(
    `${indent(2)}${id}: {`,
    `${indent(3)}Locales: ${locales};`,
    `${indent(3)}Messages: ${wrapWithLocale(messages)};`,
    `${indent(3)}Replacements: ${wrapWithLocale(replacements)};`,
    `${indent(3)}Rich: ${wrapWithLocale(rich)};`,
    `${indent(2)}};`,
  );
}

// Close the declaration block and expose a marker export.
export function appendFooter(lines: string[]) {
  lines.push(`${indent(1)}}`, `}`, `export type __dummy = void;`);
}

// TODO: align with the generated types key in intor
export const INTOR_GENERATED_KEY = "__intor_generated__";

// Append the declaration prologue for the generated global interface.
export function appendHeader(lines: string[], interfaceName: string) {
  lines.push(
    `declare global {`,
    `${indent(1)}interface ${interfaceName} {`,
    `${indent(2)}${INTOR_GENERATED_KEY}: true;`,
  );
}
