/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { IntorResolvedConfig } from "../../../../dist/types/src/config";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";
import { intor, type IntorResult } from "../../../../dist/types/src/server";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

const defaults = [{} as IntorResolvedConfig, "en-US"] as const;

//-------------------------------------------------
// Intor
//-------------------------------------------------
// --- GenConfigKeys: __default__
{
  const result = intor(...defaults) as Promise<IntorResult>;
  type Locale = Awaited<typeof result>["locale"];
  expectType<"en-US" | "zh-TW">(null as unknown as Locale);
}

// --- GenConfigKeys: config2 (Specified)
{
  const result = intor<"config2">(...defaults) as Promise<
    IntorResult<"config2">
  >;
  type Locale = Awaited<typeof result>["locale"];
  expectType<"en-US" | "fr-FR">(null as unknown as Locale);
}
