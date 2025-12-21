/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IntorResolvedConfig } from "../../../../dist/src/config";
import { expectType } from "tsd";
import { getTranslator } from "../../../../dist/export/server";

declare global {
  interface IntorGeneratedTypes {}
}

const defaults = {
  config: {} as IntorResolvedConfig,
  locale: "en-US",
} as const;

//-------------------------------------------------
// getTranslator / t()
//-------------------------------------------------
{
  const translator = getTranslator({ ...defaults });
  type Translate = Awaited<typeof translator>["t"];
  expectType<string | undefined>(null as unknown as Parameters<Translate>[0]);
}

// With preKey
{
  const translator = getTranslator({ ...defaults, preKey: "preKey" });
  type Translate = Awaited<typeof translator>["t"];
  expectType<string | undefined>(null as unknown as Parameters<Translate>[0]);
}

//-------------------------------------------------
// useTranslator / locale
//-------------------------------------------------
{
  const translator = getTranslator({ ...defaults });
  type Locale = Awaited<typeof translator>["locale"];
  expectType<string>(null as unknown as Locale);
}
