/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IntorResolvedConfig } from "../../../../dist/src/config";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";
import { getTranslator } from "../../../../dist/export/server";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

const defaults = {
  config: {} as IntorResolvedConfig,
  locale: "en-US",
} as const;

//-------------------------------------------------
// getTranslator / t()
//-------------------------------------------------
// --- GenConfigKeys: __default__ (implicit)
{
  const translator = getTranslator({ ...defaults });
  type Translate = Awaited<typeof translator>["t"];
  expectType<"hello" | "nested.key" | undefined>(
    null as unknown as Parameters<Translate>[0],
  );
}

// With preKey
{
  const translator = getTranslator({ ...defaults, preKey: "hello" });
  type Translate = Awaited<typeof translator>["t"];
  expectType<undefined>(null as unknown as Parameters<Translate>[0]);
}
// With preKey
{
  const translator = getTranslator({ ...defaults, preKey: "nested" });
  type Translate = Awaited<typeof translator>["t"];
  expectType<"key" | undefined>(null as unknown as Parameters<Translate>[0]);
}
// --- GenConfigKeys: config2 (Specified)
{
  const translator = getTranslator<"config2">({ ...defaults });
  type Translate = Awaited<typeof translator>["t"];
  expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | undefined>(
    null as unknown as Parameters<Translate>[0],
  );
}

// NOTE:
// With explicit config + preKey,
// scoped leaf key inference degrades due to TS limitations.
// This behavior is intentional.

// With preKey
{
  const translator = getTranslator<"config2">({ ...defaults, preKey: "hello" });
  type Translate = Awaited<typeof translator>["t"];
  expectType<
    "key" | "d" | "c.d" | "b.c.d" | "a.b.c.d" | undefined // whole node keys
  >(null as unknown as Parameters<Translate>[0]);
}
// With preKey
{
  const translator = getTranslator<"config2">({
    ...defaults,
    preKey: "nested",
  });
  type Translate = Awaited<typeof translator>["t"];
  expectType<
    "key" | "d" | "c.d" | "b.c.d" | "a.b.c.d" | undefined // whole node keys
  >(null as unknown as Parameters<Translate>[0]);
}
// With preKey
{
  const translator = getTranslator<"config2">({
    ...defaults,
    preKey: "nested2",
  });
  type Translate = Awaited<typeof translator>["t"];
  expectType<
    "key" | "d" | "c.d" | "b.c.d" | "a.b.c.d" | undefined // whole node keys
  >(null as unknown as Parameters<Translate>[0]);
}
//-------------------------------------------------
// getTranslator / locale
//-------------------------------------------------
// --- GenConfigKeys: __default__ (implicit)
{
  const translator = getTranslator({ ...defaults });
  type Locale = Awaited<typeof translator>["locale"];
  expectType<"en-US" | "zh-TW">(null as unknown as Locale);
}
// --- GenConfigKeys: config2 (Specified)
{
  const translator = getTranslator<"config2">({ ...defaults });
  type Locale = Awaited<typeof translator>["locale"];
  expectType<"en-US" | "fr-FR">(null as unknown as Locale);
}
