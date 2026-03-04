/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  BaseTranslator,
  ReactTranslator,
  SvelteTranslator,
  VueTranslator,
} from "../../../../dist/types/export/internal";
import type { LocaleMessages, Replacement } from "intor-translator";
import { get } from "svelte/store";
import { expectType } from "tsd";
import { VNodeChild } from "vue";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// BaseTranslator / t()
//-------------------------------------------------

expectType<string | (string & {}) | undefined>(
  null as unknown as Parameters<
    BaseTranslator<LocaleMessages, unknown, undefined>["t"]
  >[0],
);

expectType<string | (string & {}) | undefined>(
  null as unknown as Parameters<
    BaseTranslator<LocaleMessages, unknown, "preKey">["t"]
  >[0],
);

expectType<Replacement | undefined>(
  null as unknown as Parameters<BaseTranslator<LocaleMessages>["t"]>[1],
);

//-------------------------------------------------
// Framework Translators / adapter-specific overrides
//-------------------------------------------------

type M = { "{locale}": { hello: 'Hello <a href="/">{name}</a>' } };
type RE = { "{locale}": { hello: { name: string } } };
type RI = { "{locale}": { hello: { a: unknown } } };

// ReactTranslator<MessageSchema, ReplacementShape, RichShape>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t, tRich }: ReactTranslator<M, RE, RI> = {} as any;
  expectType<'Hello <a href="/">{name}</a>'>(t("hello", { name: "" }));
  expectType<React.ReactNode[]>(tRich("hello", { a: (c) => c }, { name: "" }));
}

// VueTranslator<MessageSchema, ReplacementShape, RichShape>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t, tRich }: VueTranslator<M, RE, RI> = {} as any;
  expectType<'Hello <a href="/">{name}</a>'>(t("hello", { name: "" }));
  expectType<VNodeChild[]>(tRich("hello", { a: (c) => c }, { name: "" }));
}

// SvelteTranslator<MessageSchema, ReplacementShape, RichShape>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t, tRich }: SvelteTranslator<M, RE, RI> = {} as any;
  expectType<'Hello <a href="/">{name}</a>'>(get(t)("hello", { name: "" }));
  expectType<string>(get(tRich)("hello", { a: (c) => `${c}` }, { name: "" }));
}
