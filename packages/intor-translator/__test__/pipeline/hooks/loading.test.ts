import type { TranslateContext, HandlerContext } from "../../../src/pipeline";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loading } from "../../../src/pipeline/hooks/loading";
import * as handlerUtil from "../../../src/pipeline/utils/make-handler-context";

describe("loading", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should do nothing when isLoading is false", () => {
    const ctx = {
      isLoading: false,
      config: {},
    } as unknown as TranslateContext;
    const result = loading.run(ctx);
    expect(result).toBeUndefined();
  });

  it("should call loadingHandler and return its result", () => {
    const mockCtxSnapshot = { mock: true } as unknown as HandlerContext;
    const mockResult = "loading-from-handler";
    const makeCtxSpy = vi
      .spyOn(handlerUtil, "makeHandlerContext")
      .mockReturnValue(mockCtxSnapshot);
    const loadingHandler = vi.fn().mockReturnValue(mockResult);
    const ctx = {
      isLoading: true,
      config: {
        handlers: {
          loadingHandler,
        },
      },
    } as unknown as TranslateContext;
    const result = loading.run(ctx); // handler called
    expect(loadingHandler).toHaveBeenCalledWith(mockCtxSnapshot); // return correct result
    expect(result).toEqual({
      early: true,
      output: mockResult,
    }); // makeHandlerContext called correctly
    expect(makeCtxSpy).toHaveBeenCalledWith(ctx);
  });

  it("should return loadingMessage when no loadingHandler is provided", () => {
    const ctx = {
      isLoading: true,
      config: {
        loadingMessage: "Loading…",
      },
    } as unknown as TranslateContext;
    const result = loading.run(ctx);
    expect(result).toEqual({
      early: true,
      output: "Loading…",
    });
  });

  it("should not return early when loadingMessage is undefined", () => {
    const ctx = {
      isLoading: true,
      config: {
        loadingMessage: undefined,
      },
    } as unknown as TranslateContext;
    const result = loading.run(ctx);
    expect(result).toBeUndefined();
  });

  it("should return empty string when loadingMessage is an empty string", () => {
    const ctx = {
      isLoading: true,
      config: {
        loadingMessage: "",
      },
    } as unknown as TranslateContext;
    const result = loading.run(ctx);
    expect(result).toEqual({
      early: true,
      output: "",
    });
  });

  it("should return undefined when isLoading is true but no handler or loadingMessage is provided", () => {
    const ctx = {
      isLoading: true,
      config: {},
    } as unknown as TranslateContext;
    const result = loading.run(ctx);
    expect(result).toBeUndefined();
  });
});
