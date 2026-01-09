/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { TranslatorInstance } from "../../../../dist/types/export/internal";
import type { LocaleMessages, Replacement } from "intor-translator";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// TranslatorInstance / t()
//-------------------------------------------------

expectType<string | (string & {}) | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, unknown, undefined>["t"]
  >[0],
);

expectType<string | (string & {}) | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, unknown, "preKey">["t"]
  >[0],
);

expectType<Replacement | undefined>(
  null as unknown as Parameters<TranslatorInstance<LocaleMessages>["t"]>[1],
);

// ReplacementSchema provided (inference mode)
export const messages = { en: { a: { greeting: "Hello, {name}" }, b: 123 } };
type R = { "{locale}": { a: { greeting: { name: string } } } };
declare const t: TranslatorInstance<typeof messages, R>["t"];
expectType<string>(t("a.greeting", { name: "" }));
t("a.greeting", {});
