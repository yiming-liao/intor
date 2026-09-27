/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  SafeExtract,
  FallbackConfig,
} from "../../../../dist/types/export";
import type {
  GenConfigKeys,
  GenConfig,
} from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import type { LocaleMessages } from "intor-translator";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

//-------------------------------------------------
// GenConfigKeys
//-------------------------------------------------
expectType<"__default__" | "config1" | "config2" | "sitero-web-client">(
  null as unknown as GenConfigKeys,
);

//-------------------------------------------------
// GenConfig
//-------------------------------------------------
// GenConfigKeys: __default__
expectType<"en-US" | "zh-TW">(
  null as unknown as GenConfig<"__default__">["Locales"],
);
expectType<{
  "en-US": { hello: string; nested: { key: string } };
  "zh-TW": { hello: string; nested: { key: string } };
}>(null as unknown as GenConfig<"__default__">["Messages"]);

// GenConfigKeys: config1
expectType<"en-US" | "zh-TW">(
  null as unknown as GenConfig<"config1">["Locales"],
);
expectType<{
  "en-US": { hello: string; nested: { key: string } };
  "zh-TW": { hello: string; nested: { key: string } };
}>(null as unknown as GenConfig<"config1">["Messages"]);

// GenConfigKeys: config2
expectType<"en-US" | "fr-FR">(
  null as unknown as GenConfig<"config2">["Locales"],
);
expectType<{
  "en-US": {
    hello: string;
    nested: { key: string };
    nested2: { a: { b: { c: { d: string } } } };
  };
  "fr-FR": {
    hello: string;
    nested: { key: string };
    nested2: { a: { b: { c: { d: string } } } };
  };
}>(null as unknown as GenConfig<"config2">["Messages"]);

// Unknown message content must not discard generated locales or metadata.
type WebConfig = GenConfig<"sitero-web-client">;
expectType<"zh-TW" | "en-US">(null as unknown as WebConfig["Locales"]);
expectType<Record<"zh-TW" | "en-US", LocaleMessages[string]>>(
  null as unknown as WebConfig["Messages"],
);
expectType<GeneratedTypesFixture["sitero-web-client"]["Replacements"]>(
  null as unknown as WebConfig["Replacements"],
);
expectType<GeneratedTypesFixture["sitero-web-client"]["Rich"]>(
  null as unknown as WebConfig["Rich"],
);
expectType<FallbackConfig>(null as unknown as SafeExtract<unknown>);
expectType<FallbackConfig>(
  null as unknown as SafeExtract<{
    Locales: number;
    Messages: { "{locale}": unknown };
    Replacements: unknown;
    Rich: unknown;
  }>,
);
