import type {
  ReactTranslator,
  SvelteTranslator,
  VueTranslator,
} from "../../../../dist/types/export/internal";
import { getTranslator as getEdgeTranslator } from "../../../../dist/types/export/edge";
import { getTranslator as getExpressTranslator } from "../../../../dist/types/export/express";
import { getTranslator as getFastifyTranslator } from "../../../../dist/types/export/fastify";
import { getTranslator as getHonoTranslator } from "../../../../dist/types/export/hono";
import { getTranslator as getNextServerTranslator } from "../../../../dist/types/export/next/server";
import { useTranslator as useReactTranslator } from "../../../../dist/types/export/react";
import { getTranslator as getServerTranslator } from "../../../../dist/types/export/server";
import { useTranslator as useSvelteTranslator } from "../../../../dist/types/export/svelte";
import { useTranslator as useVueTranslator } from "../../../../dist/types/export/vue";
import type { LocaleMessages } from "intor-translator";
import type * as React from "react";
import { get, type Readable, type Writable } from "svelte/store";
import { expectType } from "tsd";
import type { ComputedRef, VNodeChild } from "vue";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// ReactTranslator
//-------------------------------------------------

{
  const translator: ReactTranslator<LocaleMessages> = {} as any;

  expectType<LocaleMessages>(translator.messages);
  expectType<string>(translator.locale);
  expectType<boolean>(translator.isLoading);
  expectType<(locale: string) => void>(translator.setLocale);

  expectType<string>(translator.t("any.key"));
  expectType<boolean>(translator.hasKey("any.key"));
  expectType<React.ReactNode[]>(translator.tRich("any.key"));
}

//-------------------------------------------------
// VueTranslator
//-------------------------------------------------

{
  const translator: VueTranslator<LocaleMessages> = {} as any;

  expectType<ComputedRef<LocaleMessages>>(translator.messages);
  expectType<ComputedRef<string>>(translator.locale);
  expectType<ComputedRef<boolean>>(translator.isLoading);
  expectType<(locale: string) => void>(translator.setLocale);

  expectType<string>(translator.t("any.key"));
  expectType<boolean>(translator.hasKey("any.key"));
  expectType<VNodeChild[]>(translator.tRich("any.key"));
}

//-------------------------------------------------
// SvelteTranslator
//-------------------------------------------------

{
  const translator: SvelteTranslator<LocaleMessages> = {} as any;

  expectType<Readable<LocaleMessages>>(translator.messages);
  expectType<Writable<string>>(translator.locale);
  expectType<Readable<boolean>>(translator.isLoading);
  expectType<(locale: string) => void>(translator.setLocale);

  expectType<string>(get(translator.t)("any.key"));
  expectType<boolean>(get(translator.hasKey)("any.key"));
  expectType<string>(get(translator.tRich)("any.key"));
}

//-------------------------------------------------
// Client Hooks / root
//-------------------------------------------------

{
  const reactTranslator = useReactTranslator();
  const vueTranslator = useVueTranslator();
  const svelteTranslator = useSvelteTranslator();

  expectType<string>(reactTranslator.t("any.key"));
  expectType<string>(vueTranslator.t("any.key"));
  expectType<string>(get(svelteTranslator.t)("any.key"));
}

//-------------------------------------------------
// Client Hooks / preKey
//-------------------------------------------------

{
  const reactTranslator = useReactTranslator("preKey");
  const vueTranslator = useVueTranslator("preKey");
  const svelteTranslator = useSvelteTranslator("preKey");

  expectType<string>(reactTranslator.t("any.key"));
  expectType<boolean>(reactTranslator.hasKey("any.key"));
  expectType<string>(vueTranslator.t("any.key"));
  expectType<boolean>(vueTranslator.hasKey("any.key"));
  expectType<string>(get(svelteTranslator.t)("any.key"));
  expectType<boolean>(get(svelteTranslator.hasKey)("any.key"));
}

//-------------------------------------------------
// Server Helpers / root
//-------------------------------------------------

void (async () => {
  const serverTranslator = await getServerTranslator({} as any, {
    locale: "en-US",
  });
  const nextTranslator = await getNextServerTranslator({} as any);
  const expressTranslator = await getExpressTranslator({} as any, {} as any);
  const fastifyTranslator = await getFastifyTranslator({} as any, {} as any);

  expectType<string>(serverTranslator.t("any.key"));
  expectType<string>(nextTranslator.t("any.key"));
  expectType<string>(expressTranslator.t("any.key"));
  expectType<string>(fastifyTranslator.t("any.key"));
})();

//-------------------------------------------------
// Server Helpers / preKey
//-------------------------------------------------

void (async () => {
  const serverTranslator = await getServerTranslator({} as any, {
    locale: "en-US",
    preKey: "preKey",
  });
  const nextTranslator = await getNextServerTranslator({} as any, {
    preKey: "preKey",
  });
  const expressTranslator = await getExpressTranslator({} as any, {} as any, {
    preKey: "preKey",
  });
  const fastifyTranslator = await getFastifyTranslator({} as any, {} as any, {
    preKey: "preKey",
  });

  expectType<string>(serverTranslator.t("any.key"));
  expectType<string>(nextTranslator.t("any.key"));
  expectType<string>(expressTranslator.t("any.key"));
  expectType<string>(fastifyTranslator.t("any.key"));
})();

//-------------------------------------------------
// Edge Helpers / root
//-------------------------------------------------

void (async () => {
  const edgeTranslator = await getEdgeTranslator({} as any, {
    locale: "en-US",
  });
  const honoTranslator = await getHonoTranslator({} as any, {} as any);

  expectType<string>(edgeTranslator.t("any.key"));
  expectType<string>(honoTranslator.t("any.key"));
})();

//-------------------------------------------------
// Edge Helpers / preKey
//-------------------------------------------------

void (async () => {
  const edgeTranslator = await getEdgeTranslator({} as any, {
    locale: "en-US",
    preKey: "preKey",
  });
  const honoTranslator = await getHonoTranslator({} as any, {} as any, {
    preKey: "preKey",
  });

  expectType<string>(edgeTranslator.t("any.key"));
  expectType<string>(honoTranslator.t("any.key"));
})();
