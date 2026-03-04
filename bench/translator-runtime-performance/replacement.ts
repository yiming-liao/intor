import { Translator } from "intor-translator";
import { measure } from "./utils";

export function runReplacement() {
  const messages = {
    "en-US": {
      hello: "Hello {name}",
    },
  };

  const translator = new Translator({
    locale: "en-US",
    messages,
  });

  return measure("Replacement resolution", 1_000_000, () => {
    translator.t("hello", { name: "Ivan" });
  });
}
