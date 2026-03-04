import type { TranslateContext, HandlerContext } from "../../../src/pipeline";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { format } from "../../../src/pipeline/hooks/format";
import * as handlerUtil from "../../../src/pipeline/utils/make-handler-context";

describe("format", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should call formatHandler and set formattedMessage", () => {
    const mockSnapshot = { mock: true } as unknown as HandlerContext;
    const mockFormatted = "FORMATTED";

    // mock snapshot builder
    const snapshotSpy = vi
      .spyOn(handlerUtil, "makeHandlerContext")
      .mockReturnValue(mockSnapshot);

    // mock format handler
    const formatHandler = vi.fn().mockReturnValue(mockFormatted);

    const ctx = {
      rawMessage: "hello",
      formattedMessage: undefined,
      config: {
        handlers: {
          formatHandler,
        },
      },
    } as unknown as TranslateContext;

    format.run(ctx);

    // handler should be called with snapshot
    expect(formatHandler).toHaveBeenCalledWith(mockSnapshot);

    // snapshot builder should be invoked with full ctx
    expect(snapshotSpy).toHaveBeenCalledWith(ctx);

    // formatted message saved
    expect(ctx.formattedMessage).toBe(mockFormatted);
  });

  it("should do nothing when rawMessage is undefined", () => {
    const ctx = {
      rawMessage: undefined,
      formattedMessage: undefined,
      config: {
        handlers: {
          formatHandler: vi.fn(),
        },
      },
    } as unknown as TranslateContext;

    format.run(ctx);

    // handler should not be called
    expect(ctx.config.handlers!.formatHandler).not.toHaveBeenCalled();

    // formattedMessage stays intact
    expect(ctx.formattedMessage).toBeUndefined();
  });

  it("should do nothing when no formatHandler is provided", () => {
    const ctx = {
      rawMessage: "hello",
      formattedMessage: undefined,
      config: {
        handlers: undefined,
      },
    } as unknown as TranslateContext;

    format.run(ctx);

    expect(ctx.formattedMessage).toBeUndefined();
  });
});
