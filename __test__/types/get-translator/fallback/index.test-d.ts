/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IntorResolvedConfig } from "../../../../dist/types/src/config";
import { expectType } from "tsd";
import { getTranslator } from "../../../../dist/types/export/server";

declare global {
  interface IntorGeneratedTypes {}
}

const config = {} as IntorResolvedConfig;
const defaults = { locale: "en-US" } as const;

//-------------------------------------------------
// getTranslator / t()
//-------------------------------------------------
{
  const translator = getTranslator(config, { ...defaults });
  type Translate = Awaited<typeof translator>["t"];
  expectType<string | undefined>(null as unknown as Parameters<Translate>[0]);
}

// With preKey
{
  const translator = getTranslator(config, { ...defaults, preKey: "preKey" });
  type Translate = Awaited<typeof translator>["t"];
  expectType<string | undefined>(null as unknown as Parameters<Translate>[0]);
}

//-------------------------------------------------
// useTranslator / locale
//-------------------------------------------------
{
  const translator = getTranslator(config, { ...defaults });
  type Locale = Awaited<typeof translator>["locale"];
  expectType<string>(null as unknown as Locale);
}
