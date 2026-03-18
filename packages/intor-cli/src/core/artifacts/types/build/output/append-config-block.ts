import { LOCALE_PLACEHOLDER } from "intor";
import { indent } from "../utils/indent";

function wrapWithLocale(type: string) {
  return `{
${indent(4)}"${LOCALE_PLACEHOLDER}": ${type};
${indent(3)}}`;
}

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
