/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generatePrompt } from "../../../../src/cli/menu/generate";
import {
  debugOption,
  messageSourceOption,
  modeOption,
  readerOptionsOption,
} from "../../../../src/cli/menu/options";
import { discoverConfigs } from "../../../../src/core";

const { noteMock } = vi.hoisted(() => ({
  noteMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  note: noteMock,
}));

vi.mock("../../../../src/core", () => ({
  discoverConfigs: vi.fn(),
}));

vi.mock("../../../../src/cli/menu/options", () => ({
  modeOption: {
    prompt: vi.fn(),
  },
  messageSourceOption: {
    prompt: vi.fn(),
    summary: vi.fn((value) => {
      if (value.mode === "none") return ["message files", "(loader)"];
      if (value.mode === "single") return ["message files", value.file];
      return [
        "message files",
        Object.entries(value.files)
          .map(([id, path]) => `${id}: ${path}`)
          .join(", "),
      ];
    }),
  },
  readerOptionsOption: {
    prompt: vi.fn(),
    extsSummary: vi.fn((value?: string[]) => [
      "exts",
      value?.join(", ") ?? "(none)",
    ]),
    customReadersSummary: vi.fn((value?: Record<string, string>) => [
      "custom readers",
      value ? Object.keys(value).join(", ") : "(none)",
    ]),
  },
  debugOption: {
    prompt: vi.fn(),
    summary: vi.fn((value: boolean) => ["debug", value ? "on" : "off"]),
  },
}));

describe("generatePrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when no config is found", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([]);

    await expect(generatePrompt()).rejects.toThrow("No Intor config found.");
  });

  it("returns empty options in default mode", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      { config: { id: "web" } },
    ] as any);
    vi.mocked(modeOption.prompt).mockResolvedValue("default");

    await expect(generatePrompt()).resolves.toEqual({});
    expect(noteMock).not.toHaveBeenCalled();
  });

  it("prompts custom generate options and renders a summary", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      { config: { id: "web" } },
    ] as any);
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(messageSourceOption.prompt).mockResolvedValue({
      mode: "mapping",
      files: { web: "messages/en/web.json" },
    });
    vi.mocked(readerOptionsOption.prompt).mockResolvedValue({
      exts: ["md"],
      customReaders: { md: "./reader-md.ts" },
    });
    vi.mocked(debugOption.prompt).mockResolvedValue(true);

    await expect(generatePrompt()).resolves.toEqual({
      messageSource: {
        mode: "mapping",
        files: { web: "messages/en/web.json" },
      },
      exts: ["md"],
      customReaders: { md: "./reader-md.ts" },
      debug: true,
    });
    expect(noteMock).toHaveBeenCalledWith(
      "message files: web: messages/en/web.json\nexts: md\ncustom readers: md\ndebug: on",
      "Generate options",
    );
  });

  it("skips empty reader options in the generated result and summary", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      { config: { id: "web" } },
    ] as any);
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(messageSourceOption.prompt).mockResolvedValue({ mode: "none" });
    vi.mocked(readerOptionsOption.prompt).mockResolvedValue({});
    vi.mocked(debugOption.prompt).mockResolvedValue(false);

    await expect(generatePrompt()).resolves.toEqual({
      messageSource: { mode: "none" },
      debug: false,
    });
    expect(noteMock).toHaveBeenCalledWith(
      "message files: (loader)\nexts: (none)\ncustom readers: (none)\ndebug: off",
      "Generate options",
    );
  });
});
