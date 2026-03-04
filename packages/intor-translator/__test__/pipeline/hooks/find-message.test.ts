import type { TranslateContext } from "../../../src/pipeline/types/context";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { findMessage } from "../../../src/pipeline/hooks/find-message";
import * as findUtil from "../../../src/shared/utils/find-message-in-locales";

describe("findMessage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves a string message and sets rawMessage", () => {
    const mockResult = "Hello from mock";
    const spy = vi
      .spyOn(findUtil, "findMessageInLocales")
      .mockReturnValue(mockResult);
    const ctx = {
      messages: {
        en: { hello: "Hello" },
        zh: { hello: "你好" },
      },
      candidateLocales: ["zh", "en"],
      key: "hello",
      rawMessage: undefined,
    } as unknown as TranslateContext;
    findMessage.run(ctx);
    expect(spy).toHaveBeenCalledWith({
      messages: ctx.messages,
      candidateLocales: ctx.candidateLocales,
      key: ctx.key,
    });
    expect(ctx.rawMessage).toBe(mockResult);
  });

  it("resolves a non-string message and sets rawMessage", () => {
    const mockResult = ["a", "b", "c"];
    vi.spyOn(findUtil, "findMessageInLocales").mockReturnValue(mockResult);
    const ctx = {
      messages: {
        en: { list: ["a", "b", "c"] },
      },
      candidateLocales: ["en"],
      key: "list",
      rawMessage: "previousValue",
    } as unknown as TranslateContext;
    findMessage.run(ctx);
    expect(ctx.rawMessage).toEqual(mockResult);
  });

  it("does not override rawMessage when util returns undefined", () => {
    vi.spyOn(findUtil, "findMessageInLocales").mockReturnValue(undefined);
    const ctx = {
      messages: {},
      candidateLocales: ["en"],
      key: "missingKey",
      rawMessage: "previousValue",
    } as unknown as TranslateContext;
    findMessage.run(ctx);
    expect(ctx.rawMessage).toBe("previousValue");
  });
});
