/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";
import { useTranslator } from "../../../../dist/export/react";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

//-------------------------------------------------
// useTranslator / t()
//-------------------------------------------------
// --- GenConfigKeys: __default__ (implicit)
{
  const translator = useTranslator();
  type Translate = (typeof translator)["t"];
  expectType<"hello" | "nested.key" | undefined>(
    null as unknown as Parameters<Translate>[0],
  );
}

// With preKey
{
  const translator = useTranslator("hello");
  type Translate = (typeof translator)["t"];
  expectType<undefined>(null as unknown as Parameters<Translate>[0]);
}
// With preKey
{
  const translator = useTranslator("nested");
  type Translate = (typeof translator)["t"];
  expectType<"key" | undefined>(null as unknown as Parameters<Translate>[0]);
}
// --- GenConfigKeys: config2 (Specified)
{
  const translator = useTranslator<"config2">();
  type Translate = (typeof translator)["t"];
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
  const translator = useTranslator<"config2">("hello");
  type Translate = (typeof translator)["t"];
  expectType<
    "key" | "d" | "c.d" | "b.c.d" | "a.b.c.d" | undefined // whole node keys
  >(null as unknown as Parameters<Translate>[0]);
}
// With preKey
{
  const translator = useTranslator<"config2">("nested");
  type Translate = (typeof translator)["t"];
  expectType<
    "key" | "d" | "c.d" | "b.c.d" | "a.b.c.d" | undefined // whole node keys
  >(null as unknown as Parameters<Translate>[0]);
}
// With preKey
{
  const translator = useTranslator<"config2">("nested2");
  type Translate = (typeof translator)["t"];
  expectType<
    "key" | "d" | "c.d" | "b.c.d" | "a.b.c.d" | undefined // whole node keys
  >(null as unknown as Parameters<Translate>[0]);
}
//-------------------------------------------------
// useTranslator / setLocale()
//-------------------------------------------------
// --- GenConfigKeys: __default__ (implicit)
{
  const translator = useTranslator();
  type SelLocale = (typeof translator)["setLocale"];
  expectType<"en-US" | "zh-TW">(null as unknown as Parameters<SelLocale>[0]);
}
// --- GenConfigKeys: config2 (Specified)
{
  const translator = useTranslator<"config2">();
  type SetLocale = (typeof translator)["setLocale"];
  expectType<"en-US" | "fr-FR">(null as unknown as Parameters<SetLocale>[0]);
}
