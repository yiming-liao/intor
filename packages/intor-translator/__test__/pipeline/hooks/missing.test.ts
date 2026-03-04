import type { TranslateContext, HandlerContext } from "../../../src/pipeline";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { missing } from "../../../src/pipeline/hooks/missing";
import * as handlerUtil from "../../../src/pipeline/utils/make-handler-context";

describe("missing", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should do nothing when rawMessage exists", () => {
    const ctx = {
      rawMessage: "already found",
      key: "hello",
      config: {},
    } as unknown as TranslateContext;
    const result = missing.run(ctx);
    expect(result).toBeUndefined();
  });

  it("should call missingHandler and return its result", () => {
    const mockSnapshot = { mock: true } as unknown as HandlerContext;
    const mockReturnValue = "handled-missing-msg"; // mock snapshot builder
    const snapshotSpy = vi
      .spyOn(handlerUtil, "makeHandlerContext")
      .mockReturnValue(mockSnapshot); // mock handler
    const missingHandler = vi.fn().mockReturnValue(mockReturnValue);
    const ctx = {
      rawMessage: undefined,
      key: "home.title",
      config: {
        handlers: {
          missingHandler,
        },
      },
    } as unknown as TranslateContext;
    const result = missing.run(ctx); // handler must be called
    expect(missingHandler).toHaveBeenCalledWith(mockSnapshot); // snapshot must be created using whole ctx
    expect(snapshotSpy).toHaveBeenCalledWith(ctx); // hook return shape
    expect(result).toEqual({
      early: true,
      output: mockReturnValue,
    });
  });

  it("should return missingMessage when no handler is provided", () => {
    const ctx = {
      rawMessage: undefined,
      key: "home.title",
      config: {
        missingMessage: "N/A",
      },
    } as unknown as TranslateContext;
    const result = missing.run(ctx);
    expect(result).toEqual({
      early: true,
      output: "N/A",
    });
  });

  it("should fallback to key when no handler or missingMessage exists", () => {
    const ctx = {
      rawMessage: undefined,
      key: "hello.world",
      config: {},
    } as unknown as TranslateContext;
    const result = missing.run(ctx);
    expect(result).toEqual({
      early: true,
      output: "hello.world",
    });
  });

  it("should return empty string when missingMessage is an empty string", () => {
    const ctx = {
      rawMessage: undefined,
      key: "home.title",
      config: {
        missingMessage: "",
      },
    } as unknown as TranslateContext;
    const result = missing.run(ctx);
    expect(result).toEqual({
      early: true,
      output: "",
    });
  });
});
