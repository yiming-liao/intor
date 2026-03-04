/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TranslateContext } from "../../../src/pipeline";
import type { MessageValue } from "../../../src/types";
import { describe, it, expect, vi } from "vitest";
import { translate } from "../../../src/translators/methods/translate";

describe("translate", () => {
  const baseContext: TranslateContext = {
    messages: {},
    locale: "en",
    isLoading: false,
    config: {} as any,
    key: "hello",
    candidateLocales: [],
    meta: {},
  };

  function createMockPipeline(result: any) {
    return { run: vi.fn().mockReturnValue(result) } as any;
  }

  it("returns output when pipeline short-circuits (early === true)", () => {
    const output: MessageValue = "Early Result";
    const pipeline = createMockPipeline({
      ctx: baseContext,
      early: true,
      output,
    });
    const result = translate(pipeline, baseContext);
    expect(result).toBe(output);
    expect(pipeline.run).toHaveBeenCalledWith(baseContext);
  });

  it("returns finalMessage when pipeline completes normally", () => {
    const finalMessage: MessageValue = "Final Result";
    const pipeline = createMockPipeline({
      ctx: { ...baseContext, finalMessage },
      early: false,
      output: undefined,
    });
    const result = translate(pipeline, baseContext);
    expect(result).toBe(finalMessage);
  });

  it("throws when pipeline does not produce finalMessage", () => {
    const pipeline = createMockPipeline({
      ctx: { ...baseContext },
      early: false,
      output: undefined,
    });
    expect(() => translate(pipeline, baseContext)).toThrow(
      "Invariant violated: missing hook did not produce output",
    );
  });
});
