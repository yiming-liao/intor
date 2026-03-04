import type {
  LocalizedReplacement,
  Replacement,
  ScopedReplacement,
} from "../../../dist";
import { expectType } from "tsd";

interface ReplacementShape {
  "{locale}": {
    hello: { name: string };
    nested: { key: { count: number } };
  };
}

//---------------------------------------------------------------
// LocalizedReplacement
//---------------------------------------------------------------
expectType<{ name: string }>(
  null as unknown as LocalizedReplacement<ReplacementShape, "hello">,
);

expectType<{ key: { count: number } }>(
  null as unknown as LocalizedReplacement<ReplacementShape, "nested">,
);

expectType<Replacement>(
  null as unknown as LocalizedReplacement<ReplacementShape, "missing">,
);

expectType<Replacement>(
  null as unknown as LocalizedReplacement<
    { "{locale}": { hello: string } },
    "hello"
  >,
);

expectType<Replacement>(
  null as unknown as LocalizedReplacement<ReplacementShape, string>,
);

//---------------------------------------------------------------
// ScopedReplacement
//---------------------------------------------------------------
expectType<{ count: number }>(
  null as unknown as ScopedReplacement<ReplacementShape, "nested", "key">,
);

expectType<Replacement>(
  null as unknown as ScopedReplacement<ReplacementShape, "nested", "missing">,
);
