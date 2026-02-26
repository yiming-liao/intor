/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as loggerModule from "../../../../src/core/logger";
import { mergeMessages } from "../../../../src/core/messages/merge-messages";
import * as utilsModule from "../../../../src/core/utils";

describe("mergeMessages", () => {
  let debug: ReturnType<typeof vi.fn>;
  let child: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    debug = vi.fn();
    child = vi.fn(() => ({ debug }));
    vi.spyOn(loggerModule, "getLogger").mockReturnValue({
      child,
    } as any);
  });

  it("merges only the target locale and preserves others", () => {
    vi.spyOn(utilsModule, "deepMerge").mockReturnValue({
      merged: true,
    } as any);
    const result = mergeMessages(
      {
        en: { a: 1 },
        zh: { b: 2 },
      } as any,
      {
        en: { c: 3 },
      } as any,
      {
        config: { id: "x", logger: {} } as any,
        locale: "en",
      },
    );
    expect(result).toEqual({
      en: { merged: true },
      zh: { b: 2 },
    });
  });

  it("logs override events", () => {
    vi.spyOn(utilsModule, "deepMerge").mockImplementation((_a, _b, options) => {
      options?.onOverride?.({
        kind: "override",
        path: "test.key",
        prev: "a",
        next: "b",
      });
      return {};
    });
    mergeMessages({ en: { test: "a" } } as any, { en: { test: "b" } } as any, {
      config: { id: "x", logger: {} } as any,
      locale: "en",
    });
    expect(debug).toHaveBeenCalledWith(
      expect.stringContaining("Override"),
      expect.objectContaining({
        prev: "a",
        next: "b",
      }),
    );
  });

  it("does not log add events", () => {
    vi.spyOn(utilsModule, "deepMerge").mockImplementation((_a, _b, options) => {
      options?.onOverride?.({
        kind: "add",
        path: "new.key",
        prev: undefined,
        next: "b",
      });
      return {};
    });
    mergeMessages({ en: {} } as any, { en: { test: "b" } } as any, {
      config: { id: "x", logger: {} } as any,
      locale: "en",
    });
    expect(debug).not.toHaveBeenCalled();
  });

  it("calls onEvent and suppresses logging when provided", () => {
    vi.spyOn(utilsModule, "deepMerge").mockImplementation((_a, _b, options) => {
      options?.onOverride?.({
        kind: "override",
        path: "test.key",
        prev: "a",
        next: "b",
      });
      return {};
    });
    const onEvent = vi.fn();
    mergeMessages({ en: { test: "a" } } as any, { en: { test: "b" } } as any, {
      config: { id: "x", logger: {} } as any,
      locale: "en",
      onEvent,
    });
    expect(onEvent).toHaveBeenCalled();
    expect(debug).not.toHaveBeenCalled();
  });

  it("handles undefined message inputs", () => {
    vi.spyOn(utilsModule, "deepMerge").mockReturnValue({} as any);
    const result = mergeMessages(undefined, undefined, {
      config: { id: "x", logger: {} } as any,
      locale: "en",
    });
    expect(result).toEqual({
      en: {},
    });
  });
});
