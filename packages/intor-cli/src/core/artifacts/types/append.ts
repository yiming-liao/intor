import { LOCALE_PLACEHOLDER } from "intor";
import { GENERATED_FIELD, INTOR_GENERATED_KEY } from "./contract";
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
    `${indent(3)}${GENERATED_FIELD.locales}: ${locales};`,
    `${indent(3)}${GENERATED_FIELD.messages}: ${wrapWithLocale(messages)};`,
    `${indent(3)}${GENERATED_FIELD.replacements}: ${wrapWithLocale(replacements)};`,
    `${indent(3)}${GENERATED_FIELD.rich}: ${wrapWithLocale(rich)};`,
    `${indent(2)}};`,
  );
}

// Close the declaration block and expose a marker export.
export function appendFooter(lines: string[]) {
  lines.push(`${indent(1)}}`, `}`, `export type __dummy = void;`);
}

// Append the declaration prologue for the generated global interface.
export function appendHeader(lines: string[], interfaceName: string) {
  lines.push(
    `declare global {`,
    `${indent(1)}interface ${interfaceName} {`,
    `${indent(2)}${INTOR_GENERATED_KEY}: true;`,
  );
}
