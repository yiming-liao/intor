/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../../src/shared/log/render", () => ({
  dim: vi.fn((value: string) => value),
  green: vi.fn((value: string) => value),
  red: vi.fn((value: string) => value),
  yellow: vi.fn((value: string) => value),
}));

describe("createLogger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns noop handlers when disabled", async () => {
    const { createLogger } = await import("../../../../src/shared/log/logger");
    const logger = createLogger(false);

    logger.header("hello");
    logger.log("hello");
    logger.footer("hello");
    logger.process("ok", "hello");
    logger.ok("hello");
    logger.error("hello");

    expect(console.log).not.toHaveBeenCalled();
  });

  it("renders header, log, footer, process, ok, and error output", async () => {
    const { createLogger } = await import("../../../../src/shared/log/logger");
    const logger = createLogger(true);

    logger.header("head", {
      prefix: "> ",
      kind: "process",
      lineBreakBefore: 1,
      lineBreakAfter: 1,
    });
    logger.log("body", { prefix: "> " });
    logger.footer("foot", {
      prefix: "> ",
      kind: "process",
      lineBreakBefore: 1,
      lineBreakAfter: 1,
    });
    logger.process("ok", "loaded");
    logger.process("warn", "careful");
    logger.process("skip", "ignored");
    logger.process("load", "module");
    (logger.process as any)("other", "fallback");
    logger.ok("done");
    logger.error("failed");

    expect(console.log).toHaveBeenCalledWith("│  ");
    expect(console.log).toHaveBeenCalledWith("> ┌─ ○ head");
    expect(console.log).toHaveBeenCalledWith("> │  body");
    expect(console.log).toHaveBeenCalledWith("> └─ ● foot");
    expect(console.log).toHaveBeenCalledWith("│  │ ok   │ loaded");
    expect(console.log).toHaveBeenCalledWith("│  │ warn │ careful");
    expect(console.log).toHaveBeenCalledWith("│  │ skip │ ignored");
    expect(console.log).toHaveBeenCalledWith("│  │ load │ module");
    expect(console.log).toHaveBeenCalledWith("│  │ other │ fallback");
    expect(console.log).toHaveBeenCalledWith("╶─ ✔ done");
    expect(console.log).toHaveBeenCalledWith("╶─ ✖ failed");
  });

  it("uses default options for header, log, and footer", async () => {
    const { createLogger } = await import("../../../../src/shared/log/logger");
    const logger = createLogger(true);

    logger.header();
    logger.log();
    logger.footer();

    expect(console.log).toHaveBeenCalledWith("┌─ ");
    expect(console.log).toHaveBeenCalledWith("│  ");
    expect(console.log).toHaveBeenCalledWith("└─ ");
  });
});
