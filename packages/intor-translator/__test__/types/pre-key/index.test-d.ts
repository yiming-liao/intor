/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { PreKey, LocalizedPreKey } from "../../../dist";
import { expectType } from "tsd";

type Messages = {
  en: {
    greeting: string;
    nested: { key: string };
  };
  zh: {
    count: 123;
    nested: { key: string };
  };
};

//---------------------------------------------------------------
// PreKey
//---------------------------------------------------------------
expectType<"greeting" | "nested" | "nested.key">(
  null as unknown as PreKey<Messages["en"]>,
);
expectType<never>(null as unknown as PreKey<{}>);
expectType<never>(null as unknown as PreKey<any>);

//---------------------------------------------------------------
// LocalizedPreKey
//---------------------------------------------------------------
expectType<"greeting" | "nested" | "nested.key" | "count">(
  null as unknown as LocalizedPreKey<Messages>,
);
expectType<never>(null as unknown as LocalizedPreKey<{}>);
