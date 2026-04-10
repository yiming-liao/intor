import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkPrompt } from "../../../../src/cli/menu/check";
import {
  debugOption,
  formatOption,
  modeOption,
  outputOption,
  tsconfigPathOption,
} from "../../../../src/cli/menu/options";

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
  tsconfigPathOption: {
    prompt: vi.fn(),
    summary: vi.fn((value?: string) => ["tsconfig", value ?? "tsconfig.json"]),
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

describe("checkPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty options in default mode", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("default");

    await expect(checkPrompt()).resolves.toEqual({});
    expect(noteMock).not.toHaveBeenCalled();
  });

  it("prompts custom options and renders a summary", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(tsconfigPathOption.prompt).mockResolvedValue("tsconfig.app.json");
    vi.mocked(formatOption.prompt).mockResolvedValue("json");
    vi.mocked(outputOption.prompt).mockResolvedValue("report.json");
    vi.mocked(debugOption.prompt).mockResolvedValue(true);

    await expect(checkPrompt()).resolves.toEqual({
      tsconfigPath: "tsconfig.app.json",
      format: "json",
      output: "report.json",
      debug: true,
    });
    expect(noteMock).toHaveBeenCalledWith(
      "tsconfig: tsconfig.app.json\nformat: json\noutput: report.json\ndebug: on",
      "Check options",
    );
  });

  it("skips empty optional values", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(tsconfigPathOption.prompt).mockResolvedValue("   ");
    vi.mocked(formatOption.prompt).mockResolvedValue("human");
    vi.mocked(debugOption.prompt).mockResolvedValue(false);

    await expect(checkPrompt()).resolves.toEqual({
      format: "human",
      debug: false,
    });
    expect(outputOption.prompt).not.toHaveBeenCalled();
    expect(noteMock).toHaveBeenCalledWith(
      "tsconfig: tsconfig.json\nformat: human\noutput: stdout\ndebug: off",
      "Check options",
    );
  });

  it("skips an empty json output path", async () => {
    vi.mocked(modeOption.prompt).mockResolvedValue("custom");
    vi.mocked(tsconfigPathOption.prompt).mockResolvedValue("tsconfig.json");
    vi.mocked(formatOption.prompt).mockResolvedValue("json");
    vi.mocked(outputOption.prompt).mockResolvedValue("   ");
    vi.mocked(debugOption.prompt).mockResolvedValue(false);

    await expect(checkPrompt()).resolves.toEqual({
      tsconfigPath: "tsconfig.json",
      format: "json",
      debug: false,
    });
    expect(noteMock).toHaveBeenCalledWith(
      "tsconfig: tsconfig.json\nformat: json\noutput: stdout\ndebug: off",
      "Check options",
    );
  });
});
