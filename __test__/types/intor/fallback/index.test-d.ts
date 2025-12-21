/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IntorResolvedConfig } from "../../../../dist/src/config";
import { expectType } from "tsd";
import { intor } from "../../../../dist/src/server";

declare global {
  interface IntorGeneratedTypes {}
}

const defaults = [{} as IntorResolvedConfig, { locale: "en-US" }] as const;

//-------------------------------------------------
// Intor
//-------------------------------------------------
{
  const result = intor(...defaults);
  type InitialLocale = Awaited<typeof result>["initialLocale"];
  expectType<string>(null as unknown as InitialLocale);
}
