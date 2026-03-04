/* eslint-disable @typescript-eslint/no-explicit-any */
import { Translator } from "intor-translator";
import { measure } from "./utils";

export function runResolutionRandom() {
  const messages = {
    "en-US": {
      a: "A",
      b: "B",
      c: "C",
      d: "D",
      nested: {
        x: "X",
        y: "Y",
      },
    },
  };

  const translator = new Translator({
    locale: "en-US",
    messages,
  });

  const keys = ["a", "b", "c", "d", "nested.x", "nested.y"];
  let i = 0;

  return measure("Random resolution", 1_000_000, () => {
    translator.t(keys[i++ % keys.length] as any);
  });
}
