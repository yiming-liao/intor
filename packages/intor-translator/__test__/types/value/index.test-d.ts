/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  Value,
  LocalizedValue,
  ScopedValue,
  LocaleMessages,
} from "../../../dist";
import { expectType } from "tsd";

type Messages = {
  en: {
    greeting: string;
    nested: { key: string };
  };
  zh: {
    count: number;
    nested: { key: string };
  };
};

//---------------------------------------------------------------
// Value
//---------------------------------------------------------------
expectType<string>(null as unknown as Value<Messages["en"], "greeting">);
expectType<number>(null as unknown as Value<Messages["zh"], "count">);
expectType<never>(null as unknown as Value<{}, "">);
expectType<any>(null as unknown as Value<any, "">);

//---------------------------------------------------------------
// LocalizedValue
//---------------------------------------------------------------
expectType<string>(null as unknown as LocalizedValue<Messages, "nested.key">);
expectType<never>(null as unknown as LocalizedValue<Messages, "greeting">);
expectType<string>(null as unknown as LocalizedValue<LocaleMessages, any>);

//---------------------------------------------------------------
// ScopedValue
//---------------------------------------------------------------
expectType<string>(null as unknown as ScopedValue<Messages, "nested", "key">);
expectType<never>(
  null as unknown as ScopedValue<Messages, "nested", "missing">,
);
expectType<string>(null as unknown as ScopedValue<LocaleMessages, any, any>);
