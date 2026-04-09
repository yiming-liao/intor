/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderSummary } from "../../../../src/features/generate/render-summary";
import { createLogger } from "../../../../src/shared";
import { bold, gray, green, italic } from "../../../../src/shared";

vi.mock("../../../../src/shared", () => ({
  createLogger: vi.fn(),
  bold: vi.fn((value: string) => value),
  gray: vi.fn((value: string) => value),
  green: vi.fn((value: string) => value),
  italic: vi.fn((value: string) => value),
}));

describe("renderSummary", () => {
  const logger = {
    header: vi.fn(),
    log: vi.fn(),
    footer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createLogger).mockReturnValue(logger as any);
  });

  it("renders the summary with formatted duration", () => {
    renderSummary(".intor", 1534);

    expect(createLogger).toHaveBeenCalledWith(true);
    expect(green).toHaveBeenCalledWith("✔ intor generate completed");
    expect(bold).toHaveBeenCalledWith("✔ intor generate completed");
    expect(logger.header).toHaveBeenCalledWith("✔ intor generate completed", {
      lineBreakAfter: 1,
    });
    expect(gray).toHaveBeenCalledWith("Output directory: ".padEnd(18));
    expect(gray).toHaveBeenCalledWith("Time elapsed: ".padEnd(18));
    expect(logger.log).toHaveBeenCalledWith("Output directory: .intor");
    expect(logger.log).toHaveBeenCalledWith("Time elapsed:     1.53s");
    expect(italic).toHaveBeenCalledWith("Remember to include ");
    expect(italic).toHaveBeenCalledWith(" in your tsconfig.json ");
    expect(logger.footer).toHaveBeenCalledWith(
      "Remember to include " + ".intor/**/*.d.ts" + " in your tsconfig.json ",
      { lineBreakBefore: 1 },
    );
  });

  it("passes the enabled flag to the logger factory", () => {
    renderSummary(".intor", 10, false);

    expect(createLogger).toHaveBeenCalledWith(false);
  });
});
