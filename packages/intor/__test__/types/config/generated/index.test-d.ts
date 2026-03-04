/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  GenConfigKeys,
  GenConfig,
} from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

//-------------------------------------------------
// GenConfigKeys
//-------------------------------------------------
expectType<"__default__" | "config1" | "config2">(
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
