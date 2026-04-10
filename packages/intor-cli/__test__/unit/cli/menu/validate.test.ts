import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  debugOption,
  formatOption,
  modeOption,
  outputOption,
  readerOptionsOption,
} from "../../../../src/cli/menu/options";
import { validatePrompt } from "../../../../src/cli/menu/validate";

const { noteMock } = vi.hoisted(() => ({
  noteMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  note: noteMock,
}));

vi.mock("../../../../src/cli/menu/options", () => ({
  modeOption: {
    prompt: vi.fn(),
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
  formatOption: {
    prompt: vi.fn(),
    summary: vi.fn((value: "human" | "json") => ["format", value]),
  },
  outputOption: {
    prompt: vi.fn(),
    summary: vi.fn((value?: string) => ["output", value ?? "stdout"]),
  },
  debugOption: {
    prompt: vi.fn(),
    summary: vi.fn((value: boolean) => ["debug", value ? "on" : "off"]),
  },
}));

describe("validatePrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty options in default mode", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("default");

    await expect(validatePrompt()).resolves.toEqual({});
    expect(noteMock).not.toHaveBeenCalled();
  });

  it("prompts custom validate options in human format", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(readerOptionsOption.prompt).mockResolvedValue({});
    vi.mocked(formatOption.prompt).mockResolvedValue("human");
    vi.mocked(debugOption.prompt).mockResolvedValue(false);

    await expect(validatePrompt()).resolves.toEqual({
      format: "human",
      debug: false,
    });
    expect(outputOption.prompt).not.toHaveBeenCalled();
    expect(noteMock).toHaveBeenCalledWith(
      "exts: (none)\ncustom readers: (none)\nformat: human\noutput: stdout\ndebug: off",
      "Validate options",
    );
  });

  it("prompts json output and trims empty output values", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(readerOptionsOption.prompt).mockResolvedValue({
      exts: ["yaml"],
      customReaders: { yaml: "./reader-yaml.ts" },
    });
    vi.mocked(formatOption.prompt).mockResolvedValue("json");
    vi.mocked(outputOption.prompt).mockResolvedValue("   ");
    vi.mocked(debugOption.prompt).mockResolvedValue(true);

    await expect(validatePrompt()).resolves.toEqual({
      exts: ["yaml"],
      customReaders: { yaml: "./reader-yaml.ts" },
      format: "json",
      debug: true,
    });
    expect(noteMock).toHaveBeenCalledWith(
      "exts: yaml\ncustom readers: yaml\nformat: json\noutput: stdout\ndebug: on",
      "Validate options",
    );
  });

  it("includes a json output path when one is provided", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(readerOptionsOption.prompt).mockResolvedValue({});
    vi.mocked(formatOption.prompt).mockResolvedValue("json");
    vi.mocked(outputOption.prompt).mockResolvedValue("report.json");
    vi.mocked(debugOption.prompt).mockResolvedValue(true);

    await expect(validatePrompt()).resolves.toEqual({
      format: "json",
      output: "report.json",
      debug: true,
    });
    expect(noteMock).toHaveBeenCalledWith(
      "exts: (none)\ncustom readers: (none)\nformat: json\noutput: report.json\ndebug: on",
      "Validate options",
    );
  });
});
