/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { LocalizedRich, Rich, ScopedRich } from "../../../dist";
import { expectType } from "tsd";

interface RichShape {
  "{locale}": {
    link: { a: {} };
    name: { strong: Record<string, never> };
    preKey: { info: { input: {} } };
  };
}

//---------------------------------------------------------------
// LocalizedRich
//---------------------------------------------------------------
expectType<{ a: {} }>(null as unknown as LocalizedRich<RichShape, "link">);

expectType<{ strong: Record<string, never> }>(
  null as unknown as LocalizedRich<RichShape, "name">,
);

expectType<Rich>(null as unknown as LocalizedRich<RichShape, "missing">);

expectType<Rich>(null as unknown as LocalizedRich<RichShape, string>);

//---------------------------------------------------------------
// ScopedRich
//---------------------------------------------------------------
expectType<{ input: {} }>(
  null as unknown as ScopedRich<RichShape, "preKey", "info">,
);

expectType<Rich>(null as unknown as ScopedRich<RichShape, "preKey", "missing">);
