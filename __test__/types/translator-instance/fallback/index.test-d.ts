/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  TranslatorInstance,
  TranslatorInstanceReact,
} from "../../../../dist/types/export/internal";
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

// TranslatorInstanceReact<MessageSchema, ReplacementShape, RichShape>
{
  type M = { "{locale}": { hello: 'Hello <a href="/">{name}</a>' } };
  type RE = { "{locale}": { hello: { name: string } } };
  type RI = { "{locale}": { hello: { a: unknown } } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t, tRich }: TranslatorInstanceReact<M, RE, RI> = {} as any;
  expectType<'Hello <a href="/">{name}</a>'>(t("hello", { name: "" }));
  expectType<React.ReactNode[]>(tRich("hello", { a: (c) => c }, { name: "" }));
}
