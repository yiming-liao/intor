import fs from "node:fs/promises";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { resolveMessagesReader } from "../../../../src/core/collect-messages/resolve-messages-reader";

const FIXTURES_DIR = path.resolve(__dirname, "__fixtures__/readers");

async function writeFixture(
  filename: string,
  content: string,
): Promise<string> {
  const filePath = path.join(FIXTURES_DIR, filename);
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}

describe("resolveMessagesReader", () => {
  it("resolves default exported function", async () => {
    const filePath = await writeFixture(
      "default-reader.mjs",
      `
      export default function reader() {
        return {};
      }
      `,
    );
    const reader = await resolveMessagesReader(filePath);
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
    const reader = await resolveMessagesReader(filePath);
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
    await expect(resolveMessagesReader(filePath)).rejects.toThrow(
      "No function export found",
    );
  });

  it("throws when reader file does not exist", async () => {
    const filePath = path.join(FIXTURES_DIR, "not-exist.mjs");
    await expect(resolveMessagesReader(filePath)).rejects.toThrow(
      "Reader file not found",
    );
  });

  it("returns undefined when no file path is provided", async () => {
    const reader = await resolveMessagesReader(undefined);
    expect(reader).toBeUndefined();
  });
});
