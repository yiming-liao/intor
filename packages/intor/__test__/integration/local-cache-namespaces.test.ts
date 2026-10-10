import type { LocaleMessages } from "intor-translator";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadLocalMessages } from "../../src/server/messages/load-local-messages/load-local-messages";

describe("local cache namespace selection", () => {
  let rootDir: string;
  let pool: Map<string, LocaleMessages>;

  beforeEach(async () => {
    vi.stubEnv("NODE_ENV", "production");
    rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "intor-namespaces-"));
    pool = new Map();
    await fs.mkdir(path.join(rootDir, "en"));
    for (const [name, data] of Object.entries({
      index: { root: "Root" },
      ui: { title: "UI" },
      auth: { login: "Login" },
    })) {
      await fs.writeFile(
        path.join(rootDir, "en", `${name}.json`),
        JSON.stringify(data),
      );
    }
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await fs.rm(rootDir, { recursive: true, force: true });
  });

  const load = (namespaces?: string[]) =>
    loadLocalMessages({
      id: "namespace-cache",
      locale: "en",
      rootDir,
      pool,
      allowCacheWrite: true,
      loggerOptions: { id: "namespace-cache" },
      ...(namespaces !== undefined ? { namespaces } : {}),
    });

  it.each(["all-first", "root-first"])(
    "separates unrestricted and root-only cache entries: %s",
    async (order) => {
      if (order === "all-first") await load();
      else await load([]);
      expect(await load([])).toEqual({ en: { root: "Root" } });
      expect(await load()).toEqual({
        en: { root: "Root", ui: { title: "UI" }, auth: { login: "Login" } },
      });
      expect(pool.size).toBe(2);
    },
  );

  it("reuses reordered namespace selections without mutating inputs", async () => {
    const namespaces = ["ui", "auth"];
    const first = await load(namespaces);
    expect(namespaces).toEqual(["ui", "auth"]);
    expect(await load(["auth", "ui"])).toBe(first);
    expect(pool.size).toBe(1);
    expect(await load(["ui"])).toEqual({
      en: { root: "Root", ui: { title: "UI" } },
    });
    expect(pool.size).toBe(2);
  });
});
