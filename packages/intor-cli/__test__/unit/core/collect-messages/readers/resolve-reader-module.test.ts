import fs from "node:fs/promises";
import path from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveReaderModule } from "../../../../../src/core/collect-messages/readers/resolve-reader-module";

const FIXTURES_DIR = path.resolve(__dirname, "__fixtures__");

async function writeFixture(
  filename: string,
  content: string,
): Promise<string> {
  const filePath = path.join(FIXTURES_DIR, filename);
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}

describe("resolveReaderModule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves default exported function", async () => {
    const filePath = await writeFixture(
      "default-reader.mjs",
      `
      export default function reader() {
        return {};
      }
      `,
    );
    const reader = await resolveReaderModule({ filePath });
    expect(typeof reader).toBe("function");
  });

  it("falls back to the first exported function when no default export exists", async () => {
    const filePath = await writeFixture(
      "named-reader.mjs",
      `
      export function readerA() {}
      export const value = 123;
      `,
    );
    const reader = await resolveReaderModule({ filePath });
    expect(typeof reader).toBe("function");
  });

  it("throws when no function export is found", async () => {
    const filePath = await writeFixture(
      "invalid-reader.mjs",
      `
      export const foo = 1;
      export const bar = {};
      `,
    );
    await expect(resolveReaderModule({ filePath })).rejects.toThrow(
      "No function export found",
    );
  });

  it("throws when reader file does not exist", async () => {
    const filePath = path.join(FIXTURES_DIR, "not-exist.mjs");
    await expect(resolveReaderModule({ filePath })).rejects.toThrow(
      "Reader file not found",
    );
  });

  it("uses injected module loader", async () => {
    const filePath = await writeFixture(
      "loader-injected.mjs",
      "export const ignored = 1;",
    );
    const loadModule = vi.fn().mockResolvedValue({
      customReader() {
        return {};
      },
    });
    const reader = await resolveReaderModule({ filePath, loadModule });
    expect(typeof reader).toBe("function");
    expect(loadModule).toHaveBeenCalledTimes(1);
  });

  it("throws when module export is non-object and not a function", async () => {
    const filePath = await writeFixture(
      "non-object-export.mjs",
      "export default 1;",
    );
    await expect(
      resolveReaderModule({
        filePath,
        loadModule: vi.fn().mockResolvedValue("not-an-object"),
      }),
    ).rejects.toThrow("No function export found");
  });
});
