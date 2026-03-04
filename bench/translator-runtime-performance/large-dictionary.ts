/* eslint-disable unicorn/consistent-function-scoping */
import { Translator } from "intor-translator";
import { measure } from "./utils";

export function runLargeDictionary() {
  function generateMessages(count: number) {
    const obj: Record<string, string> = {};
    for (let i = 0; i < count; i++) {
      obj[`key_${i}`] = `value_${i}`;
    }
    return { "en-US": obj };
  }

  const SIZE = 100_000;

  const translator = new Translator({
    locale: "en-US",
    messages: generateMessages(SIZE),
  });

  let i = 0;

  return measure(`Large dictionary (${SIZE} keys)`, 1_000_000, () => {
    translator.t(`key_${i++ % SIZE}`);
  });
}
