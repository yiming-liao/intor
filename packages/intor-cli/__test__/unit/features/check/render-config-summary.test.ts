/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderConfigSummary } from "../../../../src/features/check/render-config-summary";
import { createLogger } from "../../../../src/shared";
import {
  br,
  cyan,
  dim,
  gray,
  yellow,
  toRelativePath,
} from "../../../../src/shared";

vi.mock("../../../../src/shared", () => ({
  createLogger: vi.fn(),
  br: vi.fn(),
  cyan: vi.fn((value: string) => value),
  dim: vi.fn((value: string) => value),
  gray: vi.fn((value: string) => value),
  yellow: vi.fn((value: string) => value),
  toRelativePath: vi.fn((value: string) => `rel/${value}`),
}));

describe("renderConfigSummary", () => {
  const logger = {
    ok: vi.fn(),
    header: vi.fn(),
    log: vi.fn(),
    footer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createLogger).mockReturnValue(logger as any);
  });

  it("does nothing when rendering is disabled", () => {
    renderConfigSummary("web", [], false);

    expect(br).not.toHaveBeenCalled();
    expect(createLogger).not.toHaveBeenCalled();
  });

  it("renders an empty summary when no groups are found", () => {
    renderConfigSummary("web", []);

    expect(createLogger).toHaveBeenCalledTimes(1);
    expect(br).toHaveBeenCalledTimes(1);
    expect(logger.ok).toHaveBeenCalledWith("web: no problems found");
    expect(logger.header).not.toHaveBeenCalled();
  });

  it("renders grouped diagnostics", () => {
    renderConfigSummary("web", [
      undefined as any,
      {
        origin: "t",
        messageKey: "greeting",
        problems: ["replacements missing: name", "rich tags unexpected: a"],
        file: "playground.tsx",
        lines: [7, 9],
      },
      {
        origin: "tRich",
        messageKey: "home.title",
        problems: ["rich tags missing: link"],
        file: "other.tsx",
        lines: [3],
      },
    ]);

    expect(cyan).toHaveBeenCalledWith("web");
    expect(yellow).toHaveBeenCalledWith(3);
    expect(logger.header).toHaveBeenCalledWith("web: 3 problem group(s)", {
      lineBreakAfter: 1,
    });
    expect(gray).toHaveBeenCalledWith("  - replacements missing: name");
    expect(gray).toHaveBeenCalledWith("  - rich tags unexpected: a");
    expect(gray).toHaveBeenCalledWith("  - rich tags missing: link");
    expect(toRelativePath).toHaveBeenCalledWith("playground.tsx");
    expect(toRelativePath).toHaveBeenCalledWith("other.tsx");
    expect(dim).toHaveBeenCalledWith("  ⚲ rel/playground.tsx:7,9");
    expect(dim).toHaveBeenCalledWith("  ⚲ rel/other.tsx:3");
    expect(logger.log).toHaveBeenCalledWith("greeting (t)");
    expect(logger.log).toHaveBeenCalledWith("home.title (tRich)");
    expect(logger.log).toHaveBeenCalledWith();
    expect(logger.footer).toHaveBeenCalledWith("", { lineBreakBefore: 1 });
  });
});
