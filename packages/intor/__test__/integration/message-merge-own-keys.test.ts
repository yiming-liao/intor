import type { MessageObject } from "intor-translator";
import { Translator } from "intor-translator";
import pLimit from "p-limit";
import { describe, expect, it } from "vitest";
import { resolveRemoteResources } from "../../src/core/messages/load-remote-messages/resolve-remote-resources";
import { parseFileEntries } from "../../src/server/messages/load-local-messages/read-locale-messages/parse-file-entries";

describe("local message merging with own special keys", () => {
  it("preserves special keys and resource paths during remote merging", () => {
    const result = resolveRemoteResources([
      { path: [], data: JSON.parse('{"__proto__":{"root":"Root"}}') },
      { path: ["__proto__"], data: { added: "Added" } },
      { path: ["nested", "__proto__"], data: { title: "Nested" } },
    ]);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    const translator = new Translator({
      locale: "en",
      messages: { en: result },
    });
    expect(translator.t("__proto__.root")).toBe("Root");
    expect(translator.t("__proto__.added")).toBe("Added");
    expect(translator.t("nested.__proto__.title")).toBe("Nested");
  });

  it.each(["__proto__", "constructor", "toString"])(
    "preserves root messages and the %s namespace through translation",
    async (namespace) => {
      const root: MessageObject = JSON.parse(
        `{"${namespace}":{"root":"Root"},"nested":{"__proto__":{"title":"Nested"}}}`,
      );
      const result = await parseFileEntries({
        fileEntries: [
          {
            namespace: "index",
            fullPath: "/messages/en/index.yaml",
            relativePath: "index.yaml",
            segments: ["index"],
            basename: "index",
          },
          {
            namespace,
            fullPath: `/messages/en/${namespace}.yaml`,
            relativePath: `${namespace}.yaml`,
            segments: [namespace],
            basename: namespace,
          },
        ],
        limit: pLimit(2),
        loggerOptions: { id: "own-keys-test" },
        readers: {
          yaml: async (filePath) =>
            filePath.endsWith("/index.yaml") ? root : { added: "Added" },
        },
      });
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(Object.hasOwn(result, namespace)).toBe(true);
      expect(result[namespace]).toEqual({ root: "Root", added: "Added" });
      const translator = new Translator({
        locale: "en",
        messages: { en: result },
      });
      expect(translator.t(`${namespace}.root`)).toBe("Root");
      expect(translator.t(`${namespace}.added`)).toBe("Added");
      expect(translator.t("nested.__proto__.title")).toBe("Nested");
    },
  );
});
