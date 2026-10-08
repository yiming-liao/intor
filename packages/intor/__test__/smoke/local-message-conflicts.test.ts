import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import pLimit from "p-limit";
import { describe, expect, it } from "vitest";
import { loadLocalMessages } from "../../src/server/messages/load-local-messages/load-local-messages";
import { parseFileEntries } from "../../src/server/messages/load-local-messages/read-locale-messages/parse-file-entries/parse-file-entries";

describe("local message conflicts", () => {
  const fileEntries = [
    {
      namespace: "auth",
      segments: ["auth", "index"],
      basename: "index",
      fullPath: "/messages/en/auth/index.test",
      relativePath: "auth/index.test",
    },
    {
      namespace: "auth",
      segments: ["auth", "login"],
      basename: "login",
      fullPath: "/messages/en/auth/login.test",
      relativePath: "auth/login.test",
    },
  ];

  it.each([0, 1])(
    "rejects duplicate keys regardless of completion order (%s)",
    async (slowIndex) => {
      const operation = parseFileEntries({
        fileEntries,
        limit: pLimit(2),
        loggerOptions: { id: "conflicts" },
        readers: {
          test: async (file) => {
            if (file === fileEntries[slowIndex]?.fullPath)
              await new Promise((resolve) => setTimeout(resolve, 10));
            return file.includes("index.test")
              ? { login: { title: "A" } }
              : { title: "B" };
          },
        },
      });
      await expect(operation).rejects.toMatchObject({
        name: "MessageConflictError",
        key: "auth.login.title",
        firstFile: fileEntries[0]?.fullPath,
        secondFile: fileEntries[1]?.fullPath,
      });
    },
  );

  it.each(["text", null, ["item"]])(
    "rejects leaf/object collisions (%j)",
    async (value) => {
      await expect(
        parseFileEntries({
          fileEntries,
          limit: pLimit(2),
          loggerOptions: { id: "conflicts" },
          readers: {
            test: async (file) =>
              file.includes("index.test") ? { login: value } : { title: "B" },
          },
        }),
      ).rejects.toMatchObject({
        name: "MessageConflictError",
        key: "auth.login",
      });
    },
  );

  it("allows different keys in a shared object", async () => {
    expect(
      await parseFileEntries({
        fileEntries,
        limit: pLimit(2),
        loggerOptions: { id: "conflicts" },
        readers: {
          test: async (file) =>
            file.includes("index.test")
              ? { login: { title: "A" } }
              : { help: "B" },
        },
      }),
    ).toEqual({ auth: { login: { title: "A", help: "B" } } });
  });

  it("propagates conflicts instead of loading a fallback", async () => {
    const rootDir = await mkdtemp(path.join(tmpdir(), "intor-conflict-"));
    try {
      await mkdir(path.join(rootDir, "en", "auth"), { recursive: true });
      await mkdir(path.join(rootDir, "fr"));
      await writeFile(
        path.join(rootDir, "en", "auth", "index.json"),
        JSON.stringify({ login: { title: "A" } }),
      );
      await writeFile(
        path.join(rootDir, "en", "auth", "login.json"),
        JSON.stringify({ title: "B" }),
      );
      await writeFile(
        path.join(rootDir, "fr", "index.json"),
        JSON.stringify({ hello: "fallback" }),
      );
      await expect(
        loadLocalMessages({
          id: "conflicts",
          locale: "en",
          fallbackLocales: ["fr"],
          rootDir,
          pool: new Map(),
          loggerOptions: { id: "conflicts" },
        }),
      ).rejects.toMatchObject({
        name: "MessageConflictError",
        key: "auth.login.title",
      });
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
