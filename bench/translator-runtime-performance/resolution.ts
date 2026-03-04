import { Translator } from "intor-translator";
import { measure } from "./utils";

export function runResolution() {
  const messages = {
    "en-US": {
      nested: {
        level1: {
          level2: {
            level3: {
              key: "Deep value",
            },
          },
        },
      },
    },
  };

  const translator = new Translator({
    locale: "en-US",
    messages,
  });

  return measure("Deep resolution (fixed key)", 1_000_000, () =>
    translator.t("nested.level1.level2.level3.key"),
  );
}
