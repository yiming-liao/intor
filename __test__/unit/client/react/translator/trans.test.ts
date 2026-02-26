// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { Trans } from "../../../../../src/client/react/translator/trans";
import { useTranslator } from "../../../../../src/client/react/translator/use-translator";

vi.mock("../../../../../src/client/react/translator/use-translator", () => ({
  useTranslator: vi.fn(),
}));

describe("React <Trans /> (pure TS)", () => {
  it("calls tRich and returns its result", () => {
    const tRichMock = vi.fn().mockReturnValue("rendered");
    (useTranslator as any).mockReturnValue({
      tRich: tRichMock,
    });
    const props = {
      i18nKey: "auth.login",
      components: { strong: () => "X" },
      values: { name: "Ivan" },
    };
    const result = Trans(props as any);
    expect(tRichMock).toHaveBeenCalledWith(
      "auth.login",
      props.components,
      props.values,
    );
    expect(result).toBe("rendered");
  });

  it("works without optional props", () => {
    const tRichMock = vi.fn().mockReturnValue("plain");
    (useTranslator as any).mockReturnValue({
      tRich: tRichMock,
    });
    const result = Trans({
      i18nKey: "simple.key",
    } as any);
    expect(tRichMock).toHaveBeenCalledWith("simple.key", undefined, undefined);
    expect(result).toBe("plain");
  });
});
