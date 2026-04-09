/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderConfigSummary } from "../../../../src/features/validate/render-config-summary";
import { renderLocaleBlocks } from "../../../../src/features/validate/render-locale-blocks";
import { createLogger } from "../../../../src/logger";
import { br, cyan, yellow } from "../../../../src/render";

vi.mock("../../../../src/logger", () => ({
  createLogger: vi.fn(),
}));

vi.mock("../../../../src/render", () => ({
  br: vi.fn(),
  cyan: vi.fn((value: string) => value),
  yellow: vi.fn((value: string) => value),
}));

vi.mock("../../../../src/features/validate/render-locale-blocks", () => ({
  renderLocaleBlocks: vi.fn(),
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
    renderConfigSummary("web", {}, false);

    expect(br).not.toHaveBeenCalled();
    expect(createLogger).not.toHaveBeenCalled();
  });

  it("renders an empty summary when no locales contain problems", () => {
    renderConfigSummary("web", {
      en: {
        missingMessages: [],
        missingReplacements: [],
        missingRich: [],
      },
    });

    expect(br).toHaveBeenCalledTimes(1);
    expect(logger.ok).toHaveBeenCalledWith("web: no problems found");
    expect(renderLocaleBlocks).not.toHaveBeenCalled();
    expect(logger.header).not.toHaveBeenCalled();
  });

  it("renders locale blocks only for locales with problems", () => {
    renderConfigSummary("web", {
      en: {
        missingMessages: [],
        missingReplacements: [],
        missingRich: [],
      },
      "zh-TW": {
        missingMessages: ["home.title"],
        missingReplacements: [],
        missingRich: [],
      },
    });

    expect(cyan).toHaveBeenCalledWith("web");
    expect(yellow).toHaveBeenCalledWith(1);
    expect(logger.header).toHaveBeenCalledWith("web: 1 problem locale(s)", {
      lineBreakAfter: 1,
    });
    expect(renderLocaleBlocks).toHaveBeenCalledWith([
      {
        locale: "zh-TW",
        missing: {
          missingMessages: ["home.title"],
          missingReplacements: [],
          missingRich: [],
        },
      },
    ]);
    expect(logger.footer).toHaveBeenCalledWith("", { lineBreakBefore: 1 });
  });
});
