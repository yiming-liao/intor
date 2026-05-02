import type {
  ReactTranslator,
  SvelteTranslator,
  VueTranslator,
} from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { getTranslator as getEdgeTranslator } from "../../../../dist/types/export/edge";
import { getTranslator as getExpressTranslator } from "../../../../dist/types/export/express";
import { getTranslator as getFastifyTranslator } from "../../../../dist/types/export/fastify";
import { getTranslator as getHonoTranslator } from "../../../../dist/types/export/hono";
import { getTranslator as getNextServerTranslator } from "../../../../dist/types/export/next/server";
import { useTranslator as useReactTranslator } from "../../../../dist/types/export/react";
import { getTranslator as getServerTranslator } from "../../../../dist/types/export/server";
import { useTranslator as useSvelteTranslator } from "../../../../dist/types/export/svelte";
import { useTranslator as useVueTranslator } from "../../../../dist/types/export/vue";
import { expectError, expectType } from "tsd";
import type * as React from "react";
import { get, type Readable, type Writable } from "svelte/store";
import type { ComputedRef, VNodeChild } from "vue";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

type M = GeneratedTypesFixture["config2"]["Messages"];
type RE = GeneratedTypesFixture["config2"]["Replacements"];
type RI = GeneratedTypesFixture["config2"]["Rich"];

//-------------------------------------------------
// ReactTranslator
//-------------------------------------------------

{
  const translator: ReactTranslator<M, RE, RI, "nested", "strict"> = {} as any;

  expectType<M>(translator.messages);
  expectType<"{locale}">(translator.locale);
  expectType<boolean>(translator.isLoading);
  expectType<(locale: "{locale}") => void>(translator.setLocale);

  expectType<string>(translator.t("key"));
  expectError(translator.t("hello"));
  expectType<boolean>(translator.hasKey("key"));
  expectError(translator.hasKey("nested.key"));
  expectType<React.ReactNode[]>(translator.tRich("key"));
  expectError(translator.tRich("nested.key"));
}

//-------------------------------------------------
// VueTranslator
//-------------------------------------------------

{
  const translator: VueTranslator<M, RE, RI, "nested", "strict"> = {} as any;

  expectType<ComputedRef<M>>(translator.messages);
  expectType<ComputedRef<"{locale}">>(translator.locale);
  expectType<ComputedRef<boolean>>(translator.isLoading);
  expectType<(locale: "{locale}") => void>(translator.setLocale);

  expectType<string>(translator.t("key"));
  expectError(translator.t("hello"));
  expectType<boolean>(translator.hasKey("key"));
  expectError(translator.hasKey("nested.key"));
  expectType<VNodeChild[]>(translator.tRich("key"));
  expectError(translator.tRich("nested.key"));
}

//-------------------------------------------------
// SvelteTranslator
//-------------------------------------------------

{
  const translator: SvelteTranslator<M, RE, RI, "nested", "strict"> = {} as any;

  expectType<Readable<M>>(translator.messages);
  expectType<Writable<"{locale}">>(translator.locale);
  expectType<Readable<boolean>>(translator.isLoading);
  expectType<(locale: "{locale}") => void>(translator.setLocale);

  expectType<string>(get(translator.t)("key"));
  expectError(get(translator.t)("hello"));
  expectType<boolean>(get(translator.hasKey)("key"));
  expectError(get(translator.hasKey)("nested.key"));
  expectType<string>(get(translator.tRich)("key"));
  expectError(get(translator.tRich)("nested.key"));
}

//-------------------------------------------------
// Client Hooks / root
//-------------------------------------------------

{
  const reactTranslator = useReactTranslator<"config2">();
  const vueTranslator = useVueTranslator<"config2">();
  const svelteTranslator = useSvelteTranslator<"config2">();

  expectType<string>(reactTranslator.t("hello"));
  expectType<string>(reactTranslator.t("this.key.does.not.exist"));
  expectType<string>(vueTranslator.t("nested.key"));
  expectType<string>(vueTranslator.t("this.key.does.not.exist"));
  expectType<string>(get(svelteTranslator.t)("nested2.a.b.c.d"));
  expectType<string>(get(svelteTranslator.t)("this.key.does.not.exist"));
}

{
  const reactTranslator = useReactTranslator<"config2", "strict">();
  const vueTranslator = useVueTranslator<"config2", "strict">();
  const svelteTranslator = useSvelteTranslator<"config2", "strict">();

  expectType<string>(reactTranslator.t("hello"));
  expectError(reactTranslator.t("this.key.does.not.exist"));
  expectType<string>(vueTranslator.t("nested.key"));
  expectError(vueTranslator.t("this.key.does.not.exist"));
  expectType<string>(get(svelteTranslator.t)("nested2.a.b.c.d"));
  expectError(get(svelteTranslator.t)("this.key.does.not.exist"));
}

//-------------------------------------------------
// Client Hooks / preKey
//-------------------------------------------------

{
  const reactTranslator = useReactTranslator<"config2">("nested");
  const vueTranslator = useVueTranslator<"config2">("nested");
  const svelteTranslator = useSvelteTranslator<"config2">("nested");

  expectType<string>(reactTranslator.t("key"));
  expectType<string>(reactTranslator.t("this.key.does.not.exist"));
  expectType<string>(vueTranslator.t("key"));
  expectType<string>(vueTranslator.t("this.key.does.not.exist"));
  expectType<string>(get(svelteTranslator.t)("key"));
  expectType<string>(get(svelteTranslator.t)("this.key.does.not.exist"));
}

{
  const reactTranslator = useReactTranslator<"config2", "strict">("nested");
  const vueTranslator = useVueTranslator<"config2", "strict">("nested");
  const svelteTranslator = useSvelteTranslator<"config2", "strict">("nested");

  expectType<string>(reactTranslator.t("key"));
  expectError(reactTranslator.t("this.key.does.not.exist"));
  expectError(reactTranslator.t("nested.key"));

  expectType<string>(vueTranslator.t("key"));
  expectError(vueTranslator.t("this.key.does.not.exist"));
  expectError(vueTranslator.t("nested.key"));

  expectType<string>(get(svelteTranslator.t)("key"));
  expectError(get(svelteTranslator.t)("this.key.does.not.exist"));
  expectError(get(svelteTranslator.t)("nested.key"));
}

expectError(useReactTranslator<"config2">("missing"));
expectError(useVueTranslator<"config2">("missing"));
expectError(useSvelteTranslator<"config2">("missing"));

//-------------------------------------------------
// Server Helpers / root
//-------------------------------------------------

void (async () => {
  const serverTranslator = await getServerTranslator<"config2">({} as any, {
    locale: "en-US",
  });
  const nextTranslator = await getNextServerTranslator<"config2">({} as any);
  const expressTranslator = await getExpressTranslator<"config2">(
    {} as any,
    {} as any,
  );
  const fastifyTranslator = await getFastifyTranslator<"config2">(
    {} as any,
    {} as any,
  );

  expectType<string>(serverTranslator.t("hello"));
  expectType<string>(nextTranslator.t("nested2.a.b.c.d"));
  expectType<string>(expressTranslator.t("this.key.does.not.exist"));
  expectType<string>(fastifyTranslator.t("this.key.does.not.exist"));
})();

void (async () => {
  const serverTranslator = await getServerTranslator<"config2", "strict">(
    {} as any,
    {
      locale: "en-US",
    },
  );
  const nextTranslator = await getNextServerTranslator<"config2", "strict">(
    {} as any,
  );
  const expressTranslator = await getExpressTranslator<"config2", "strict">(
    {} as any,
    {} as any,
  );
  const fastifyTranslator = await getFastifyTranslator<"config2", "strict">(
    {} as any,
    {} as any,
  );

  expectType<string>(serverTranslator.t("hello"));
  expectError(serverTranslator.t("this.key.does.not.exist"));
  expectType<string>(nextTranslator.t("nested2.a.b.c.d"));
  expectError(nextTranslator.t("this.key.does.not.exist"));
  expectType<string>(expressTranslator.t("hello"));
  expectError(expressTranslator.t("this.key.does.not.exist"));
  expectType<string>(fastifyTranslator.t("hello"));
  expectError(fastifyTranslator.t("this.key.does.not.exist"));
})();

//-------------------------------------------------
// Server Helpers / preKey
//-------------------------------------------------

void (async () => {
  const serverTranslator = await getServerTranslator<"config2">({} as any, {
    locale: "en-US",
    preKey: "nested",
  });
  const nextTranslator = await getNextServerTranslator<"config2">({} as any, {
    preKey: "nested",
  });
  const expressTranslator = await getExpressTranslator<"config2">(
    {} as any,
    {} as any,
    {
      preKey: "nested",
    },
  );
  const fastifyTranslator = await getFastifyTranslator<"config2">(
    {} as any,
    {} as any,
    {
      preKey: "nested",
    },
  );

  expectType<string>(serverTranslator.t("key"));
  expectType<string>(nextTranslator.t("this.key.does.not.exist"));
  expectType<string>(expressTranslator.t("this.key.does.not.exist"));
  expectType<string>(fastifyTranslator.t("this.key.does.not.exist"));
})();

void (async () => {
  const serverTranslator = await getServerTranslator<"config2", "strict">(
    {} as any,
    {
      locale: "en-US",
      preKey: "nested",
    },
  );
  const nextTranslator = await getNextServerTranslator<"config2", "strict">(
    {} as any,
    {
      preKey: "nested",
    },
  );
  const expressTranslator = await getExpressTranslator<"config2", "strict">(
    {} as any,
    {} as any,
    {
      preKey: "nested",
    },
  );
  const fastifyTranslator = await getFastifyTranslator<"config2", "strict">(
    {} as any,
    {} as any,
    {
      preKey: "nested",
    },
  );

  expectType<string>(serverTranslator.t("key"));
  expectError(serverTranslator.t("this.key.does.not.exist"));
  expectError(serverTranslator.t("nested.key"));

  expectType<string>(nextTranslator.t("key"));
  expectError(nextTranslator.t("this.key.does.not.exist"));
  expectError(nextTranslator.t("nested.key"));

  expectType<string>(expressTranslator.t("key"));
  expectError(expressTranslator.t("this.key.does.not.exist"));
  expectError(expressTranslator.t("nested.key"));

  expectType<string>(fastifyTranslator.t("key"));
  expectError(fastifyTranslator.t("this.key.does.not.exist"));
  expectError(fastifyTranslator.t("nested.key"));
})();

//-------------------------------------------------
// Edge Helpers / root
//-------------------------------------------------

void (async () => {
  const edgeTranslator = await getEdgeTranslator<"config2">({} as any, {
    locale: "en-US",
  });
  const honoTranslator = await getHonoTranslator<"config2">(
    {} as any,
    {} as any,
  );

  expectType<string>(edgeTranslator.t("nested.key"));
  expectType<string>(honoTranslator.t("this.key.does.not.exist"));
})();

void (async () => {
  const edgeTranslator = await getEdgeTranslator<"config2", "strict">(
    {} as any,
    {
      locale: "en-US",
    },
  );
  const honoTranslator = await getHonoTranslator<"config2", "strict">(
    {} as any,
    {} as any,
  );

  expectType<string>(edgeTranslator.t("nested.key"));
  expectError(edgeTranslator.t("this.key.does.not.exist"));
  expectType<string>(honoTranslator.t("hello"));
  expectError(honoTranslator.t("this.key.does.not.exist"));
})();

//-------------------------------------------------
// Edge Helpers / preKey
//-------------------------------------------------

void (async () => {
  const edgeTranslator = await getEdgeTranslator<"config2">({} as any, {
    locale: "en-US",
    preKey: "nested",
  });
  const honoTranslator = await getHonoTranslator<"config2">(
    {} as any,
    {} as any,
    {
      preKey: "nested",
    },
  );

  expectType<string>(edgeTranslator.t("this.key.does.not.exist"));
  expectType<string>(honoTranslator.t("this.key.does.not.exist"));
})();

void (async () => {
  const edgeTranslator = await getEdgeTranslator<"config2", "strict">(
    {} as any,
    {
      locale: "en-US",
      preKey: "nested",
    },
  );
  const honoTranslator = await getHonoTranslator<"config2", "strict">(
    {} as any,
    {} as any,
    {
      preKey: "nested",
    },
  );

  expectType<string>(edgeTranslator.t("key"));
  expectError(edgeTranslator.t("this.key.does.not.exist"));
  expectError(edgeTranslator.t("nested.key"));

  expectType<string>(honoTranslator.t("key"));
  expectError(honoTranslator.t("this.key.does.not.exist"));
  expectError(honoTranslator.t("nested.key"));
})();

expectError(
  getServerTranslator<"config2">({} as any, {
    locale: "en-US",
    preKey: "missing",
  }),
);
expectError(
  getEdgeTranslator<"config2">({} as any, {
    locale: "en-US",
    preKey: "missing",
  }),
);
expectError(getNextServerTranslator<"config2">({} as any, { preKey: "missing" }));
expectError(
  getExpressTranslator<"config2">({} as any, {} as any, {
    preKey: "missing",
  }),
);
expectError(
  getFastifyTranslator<"config2">({} as any, {} as any, {
    preKey: "missing",
  }),
);
expectError(
  getHonoTranslator<"config2">({} as any, {} as any, {
    preKey: "missing",
  }),
);
