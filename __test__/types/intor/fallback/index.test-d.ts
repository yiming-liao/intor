/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IntorResolvedConfig } from "../../../../dist/types/src/config";
import { expectType } from "tsd";
import { intor } from "../../../../dist/types/src/server";

declare global {
  interface IntorGeneratedTypes {}
}

const defaults = [{} as IntorResolvedConfig, "en-US"] as const;

//-------------------------------------------------
// Intor
//-------------------------------------------------
{
  const result = intor(...defaults);
  type InitialLocale = Awaited<typeof result>["initialLocale"];
  expectType<string>(null as unknown as InitialLocale);
}
