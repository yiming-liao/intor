/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi } from "vitest";
import * as rendererModule from "../../../../../src/client/vue/render";
import { createTRich } from "../../../../../src/client/vue/translator/create-t-rich";

vi.mock("intor-translator", async () => {
  const actual = await vi.importActual<any>("intor-translator");
  return {
    ...actual,
    renderRichMessage: vi.fn(),
  };
});

import { renderRichMessage } from "intor-translator";

describe("Vue createTRich", () => {
  it("composes t + renderer + renderRichMessage correctly", () => {
    const tMock = vi.fn().mockReturnValue("message");

    const rendererMock = { text: vi.fn() };

    vi.spyOn(rendererModule, "createVueRenderer").mockReturnValue(
      rendererMock as any,
    );

    (renderRichMessage as any).mockReturnValue("rendered");

    const tRich = createTRich(tMock);

    const result = tRich("hello", { strong: vi.fn() as any }, { name: "Ivan" });

    expect(tMock).toHaveBeenCalledWith("hello", { name: "Ivan" });
    expect(rendererModule.createVueRenderer).toHaveBeenCalledWith({
      strong: expect.any(Function),
    });
    expect(renderRichMessage).toHaveBeenCalledWith("message", rendererMock);
    expect(result).toBe("rendered");
  });
});
