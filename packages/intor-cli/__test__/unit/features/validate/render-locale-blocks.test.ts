/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderLocaleBlocks } from "../../../../src/features/validate/render-locale-blocks";
import { createLogger } from "../../../../src/shared";
import { dim, gray, italic } from "../../../../src/shared";

vi.mock("../../../../src/shared", () => ({
  createLogger: vi.fn(),
  dim: vi.fn((value: string) => value),
  gray: vi.fn((value: string) => value),
  italic: vi.fn((value: string) => value),
}));

describe("renderLocaleBlocks", () => {
  const logger = {
    header: vi.fn(),
    log: vi.fn(),
    footer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createLogger).mockReturnValue(logger as any);
  });

  it("renders all missing sections for a locale", () => {
    renderLocaleBlocks([
      {
        locale: "zh-TW",
        missing: {
          missingMessages: ["home.title"],
          missingReplacements: [{ key: "greeting", name: "name" }],
          missingRich: [{ key: "link", tag: "a" }],
        },
      },
    ]);

    expect(dim).toHaveBeenCalledWith("│  ");
    expect(italic).toHaveBeenCalledWith("zh-TW");
    expect(logger.header).toHaveBeenCalledWith("zh-TW", { prefix: "│  " });
    expect(gray).toHaveBeenCalledWith("Missing messages:");
    expect(gray).toHaveBeenCalledWith("Missing replacements:");
    expect(gray).toHaveBeenCalledWith("Missing rich tags:");
    expect(logger.log).toHaveBeenCalledWith("  - home.title", {
      prefix: "│  ",
    });
    expect(logger.log).toHaveBeenCalledWith("  - greeting: name", {
      prefix: "│  ",
    });
    expect(logger.log).toHaveBeenCalledWith("  - link: a", { prefix: "│  " });
    expect(logger.footer).toHaveBeenCalledWith("", { prefix: "│  " });
  });

  it("renders spacing between locales but not after the last locale", () => {
    renderLocaleBlocks([
      {
        locale: "en",
        missing: {
          missingMessages: ["home.title"],
          missingReplacements: [],
          missingRich: [],
        },
      },
      {
        locale: "ja",
        missing: {
          missingMessages: [],
          missingReplacements: [{ key: "greeting", name: "name" }],
          missingRich: [],
        },
      },
    ]);

    const plainBreakCalls = logger.log.mock.calls.filter(
      ([message, options]) => message === undefined && options === undefined,
    );

    expect(plainBreakCalls).toHaveLength(1);
  });

  it("renders only replacements without an extra section spacer", () => {
    renderLocaleBlocks([
      {
        locale: "ja",
        missing: {
          missingMessages: [],
          missingReplacements: [{ key: "greeting", name: "name" }],
          missingRich: [],
        },
      },
    ]);

    expect(logger.log).toHaveBeenCalledWith("Missing replacements:", {
      prefix: "│  ",
    });

    const prefixedBlankCalls = logger.log.mock.calls.filter(
      ([message, options]) => message === "" && options?.prefix === "│  ",
    );
    expect(prefixedBlankCalls).toHaveLength(2);
  });

  it("renders only rich tags without an extra section spacer", () => {
    renderLocaleBlocks([
      {
        locale: "fr",
        missing: {
          missingMessages: [],
          missingReplacements: [],
          missingRich: [{ key: "link", tag: "a" }],
        },
      },
    ]);

    expect(logger.log).toHaveBeenCalledWith("Missing rich tags:", {
      prefix: "│  ",
    });
    expect(logger.log).toHaveBeenCalledWith("  - link: a", { prefix: "│  " });

    const prefixedBlankCalls = logger.log.mock.calls.filter(
      ([message, options]) => message === "" && options?.prefix === "│  ",
    );
    expect(prefixedBlankCalls).toHaveLength(2);
  });
});
