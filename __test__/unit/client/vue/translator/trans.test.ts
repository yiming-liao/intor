/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { Fragment } from "vue";
import { useTranslator } from "../../../../../src/client/vue/translator/use-translator";
import { Trans } from "../../../../../export/vue";

vi.mock("../../../../../src/client/vue/translator/use-translator", () => ({
  useTranslator: vi.fn(),
}));

describe("Vue <Trans />", () => {
  it("calls tRich and returns Fragment vnode", () => {
    const tRichMock = vi.fn().mockReturnValue(["rendered"]);
    (useTranslator as any).mockReturnValue({
      tRich: tRichMock,
    });
    const props = {
      i18nKey: "auth.login",
      components: { strong: () => "X" },
      values: { name: "Ivan" },
    };
    const render = (Trans as any).setup(props);
    const vnode = render();
    expect(tRichMock).toHaveBeenCalledWith(
      "auth.login",
      props.components,
      props.values,
    );
    expect(vnode.type).toBe(Fragment);
    expect(vnode.children).toEqual(["rendered"]);
  });
});
