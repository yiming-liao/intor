import { describe, it, expect, vi, beforeEach } from "vitest";
import * as React from "react";
import * as rendererModule from "../../../../../src/client/react/render";
import { createTRich } from "../../../../../src/client/react/translator/create-t-rich";
import { renderRichMessage } from "intor-translator";

vi.mock("intor-translator", async () => {
  const actual = await vi.importActual<any>("intor-translator");
  return { ...actual, renderRichMessage: vi.fn() };
});

describe("createTRich", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("composes t + renderer + renderRichMessage correctly (single node)", () => {
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

  it("adds keys when renderRichMessage returns an array", () => {
    const tMock = vi.fn().mockReturnValue("message");
    const rendererMock = { text: vi.fn() };
    vi.spyOn(rendererModule, "createReactRenderer").mockReturnValue(
      rendererMock as any,
    );
    const el1 = React.createElement("span", null, "a");
    const el2 = React.createElement("span", null, "b");
    (renderRichMessage as any).mockReturnValue([el1, el2]);
    const tRich = createTRich(tMock);
    const result = tRich("hello");
    expect(Array.isArray(result)).toBe(true);
    expect((result[0] as any).key).toBe("0");
    expect((result[1] as any).key).toBe("1");
  });

  it("does not override existing keys", () => {
    const tMock = vi.fn().mockReturnValue("message");
    const rendererMock = { text: vi.fn() };
    vi.spyOn(rendererModule, "createReactRenderer").mockReturnValue(
      rendererMock as any,
    );
    const el = React.createElement("span", { key: "custom" }, "a");
    (renderRichMessage as any).mockReturnValue([el]);
    const tRich = createTRich(tMock);
    const result = tRich("hello");
    expect((result[0] as any).key).toBe("custom");
  });
});
