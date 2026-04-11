/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLogger } from "../../../../src/shared/log/logger";
import {
  bgBlack,
  br,
  renderConfigs,
  renderTitle,
} from "../../../../src/shared/log/render";
import { toRelativePath } from "../../../../src/shared/utils/to-relative-path";

vi.mock("picocolors", () => ({
  default: {
    dim: vi.fn((value: string) => value),
    cyan: vi.fn((value: string) => value),
    green: vi.fn((value: string) => value),
    bold: vi.fn((value: string) => value),
    italic: vi.fn((value: string) => value),
    gray: vi.fn((value: string) => value),
    yellow: vi.fn((value: string) => value),
    red: vi.fn((value: string) => value),
    bgBlack: vi.fn((value: string) => value),
  },
}));

vi.mock("../../../../src/shared/log/logger", () => ({
  createLogger: vi.fn(),
}));

vi.mock("../../../../src/shared/utils/to-relative-path", () => ({
  toRelativePath: vi.fn((value: string) => `rel/${value}`),
}));

describe("render helpers", () => {
  const logger = {
    header: vi.fn(),
    log: vi.fn(),
    footer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.mocked(createLogger).mockReturnValue(logger as any);
  });

  it("renders line breaks only when enabled", () => {
    br(2);
    br(1, false);

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it("renders the title only when enabled", () => {
    renderTitle("Hello");
    renderTitle("Hidden", false);

    expect(bgBlack(" Hello ")).toBe(" Hello ");
    expect(console.log).toHaveBeenCalledWith("  Hello ");
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it("renders discovered configs when enabled", () => {
    renderConfigs(
      [
        {
          filePath: "/repo/src/a.ts",
          config: { id: "web" },
        },
      ] as any,
      true,
    );

    expect(createLogger).toHaveBeenCalledTimes(1);
    expect(logger.header).toHaveBeenCalledWith(
      "Discovered 1 Intor config(s):",
      { lineBreakAfter: 1 },
    );
    expect(toRelativePath).toHaveBeenCalledWith("/repo/src/a.ts");
    expect(logger.log).toHaveBeenCalledWith("web  ⚲ rel//repo/src/a.ts");
    expect(logger.footer).toHaveBeenCalledWith("", { lineBreakBefore: 1 });
  });

  it("does nothing when rendering configs is disabled", () => {
    renderConfigs([] as any, false);

    expect(createLogger).not.toHaveBeenCalled();
  });
});
