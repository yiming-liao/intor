/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Key, LocalizedKey, ScopedKey } from "../../../dist";
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
// Key
//---------------------------------------------------------------
expectType<"greeting" | "nested.key">(null as unknown as Key<Messages["en"]>);
expectType<never>(null as unknown as Key<{}>);
expectType<never>(null as unknown as Key<any>);

//---------------------------------------------------------------
// LocalizedKey
//---------------------------------------------------------------
expectType<"greeting" | "nested.key" | "count">(
  null as unknown as LocalizedKey<Messages>,
);
expectType<never>(null as unknown as LocalizedKey<{}>);

//---------------------------------------------------------------
// ScopedKey
//---------------------------------------------------------------
expectType<"key">(null as unknown as ScopedKey<Messages, "nested">);
expectType<never>(null as unknown as ScopedKey<{}, "">);
expectType<never>(null as unknown as ScopedKey<Messages, string>);
expectType<never>(null as unknown as ScopedKey<Messages, "greeting">);
