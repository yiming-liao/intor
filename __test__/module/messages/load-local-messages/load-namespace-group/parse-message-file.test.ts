import fs from "node:fs/promises";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseMessageFile } from "@/modules/messages/load-local-messages/load-namespace-group/parse-message-file";

// Mock logger
vi.mock("@/shared/logger/get-logger", () => ({
  getLogger: () => ({
    child: () => ({
      warn: vi.fn(),
      trace: vi.fn(),
    }),
  }),
}));

describe("parseMessageFile", () => {
  const loggerOptions = { id: "TEST_ID" } as const;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null for empty file path", async () => {
    const result = await parseMessageFile("   ", loggerOptions);
    expect(result).toBeNull();
  });

  it("returns null for path exceeding max length", async () => {
    const longPath = "a".repeat(261);
    const result = await parseMessageFile(longPath, loggerOptions);
    expect(result).toBeNull();
  });

  it("returns null for non-JSON file", async () => {
    const filePath = "test.txt";
    const result = await parseMessageFile(filePath, loggerOptions);
    expect(result).toBeNull();
  });

  it("returns parsed JSON object for valid JSON file", async () => {
    const filePath = "test.json";
    const fakeContent = JSON.stringify({ hello: "world" });

    vi.spyOn(fs, "readFile").mockResolvedValue(fakeContent);

    const result = await parseMessageFile(filePath, loggerOptions);
    expect(result).toEqual({ hello: "world" });
  });

  it("returns null and logs warning for invalid JSON", async () => {
    const filePath = "bad.json";
    vi.spyOn(fs, "readFile").mockResolvedValue("invalid-json");

    const result = await parseMessageFile(filePath, loggerOptions);
    expect(result).toBeNull();
  });

  it("throws IntorError if JSON parses but is not an object", async () => {
    const filePath = "number.json";
    vi.spyOn(fs, "readFile").mockResolvedValue("123");

    const result = await parseMessageFile(filePath, loggerOptions);
    expect(result).toBeNull();
  });
});
