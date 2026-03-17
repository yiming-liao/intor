/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { shouldFullReload } from "../../../../src/policies";
import { decideStrategy } from "../../../../src/routing/outbound/decide-strategy";

vi.mock("../../../../src/policies", () => ({
  shouldFullReload: vi.fn(),
}));

describe("decideStrategy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 'external' when target.isExternal is true", () => {
    const result = decideStrategy(
      {} as any,
      {
        locale: "en",
        destination: "https://google.com",
        isExternal: true,
      },
      "en",
    );
    expect(result).toBe("external");
    expect(shouldFullReload).not.toHaveBeenCalled();
  });

  it("returns 'client' when locale does not change", () => {
    const result = decideStrategy(
      {} as any,
      {
        locale: "en",
        destination: "/about",
        isExternal: false,
      },
      "en",
    );
    expect(result).toBe("client");
    expect(shouldFullReload).not.toHaveBeenCalled();
  });

  it("returns 'reload' when locale changes and shouldFullReload is true", () => {
    (shouldFullReload as any).mockReturnValue(true);
    const result = decideStrategy(
      {} as any,
      {
        locale: "fr",
        destination: "/fr/about",
        isExternal: false,
      },
      "en",
    );
    expect(shouldFullReload).toHaveBeenCalled();
    expect(result).toBe("reload");
  });

  it("returns 'client' when locale changes but shouldFullReload is false", () => {
    (shouldFullReload as any).mockReturnValue(false);
    const result = decideStrategy(
      {} as any,
      {
        locale: "fr",
        destination: "/fr/about",
        isExternal: false,
      },
      "en",
    );
    expect(shouldFullReload).toHaveBeenCalled();
    expect(result).toBe("client");
  });
});
