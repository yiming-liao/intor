import { describe, it, expect, vi } from "vitest";
import * as rendererModule from "../../../../../src/client/react/render";
import { createTRich } from "../../../../../src/client/react/translator/create-t-rich";

vi.mock("intor-translator", async () => {
  const actual = await vi.importActual<any>("intor-translator");
  return {
    ...actual,
    renderRichMessage: vi.fn(),
  };
});

import { renderRichMessage } from "intor-translator";

describe("createTRich", () => {
  it("composes t + renderer + renderRichMessage correctly", () => {
    const tMock = vi.fn().mockReturnValue("message");

    const rendererMock = { text: vi.fn() };
    vi.spyOn(rendererModule, "createReactRenderer").mockReturnValue(
      rendererMock as any,
    );

    (renderRichMessage as any).mockReturnValue("rendered");

    const tRich = createTRich(tMock);

    const result = tRich("hello", { strong: vi.fn() as any }, { name: "Ivan" });

    expect(tMock).toHaveBeenCalledWith("hello", { name: "Ivan" });
    expect(rendererModule.createReactRenderer).toHaveBeenCalledWith({
      strong: expect.any(Function),
    });
    expect(renderRichMessage).toHaveBeenCalledWith("message", rendererMock);
    expect(result).toBe("rendered");
  });
});
