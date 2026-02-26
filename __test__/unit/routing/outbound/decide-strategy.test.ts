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
    const result = decideStrategy({} as any, {
      locale: "en",
      destination: "https://google.com",
      isExternal: true,
    });
    expect(result).toBe("external");
    expect(shouldFullReload).not.toHaveBeenCalled();
  });

  it("returns 'reload' when not external and shouldFullReload is true", () => {
    (shouldFullReload as any).mockReturnValue(true);
    const result = decideStrategy({} as any, {
      locale: "en",
      destination: "/about",
      isExternal: false,
    });
    expect(shouldFullReload).toHaveBeenCalled();
    expect(result).toBe("reload");
  });

  it("returns 'client' when not external and shouldFullReload is false", () => {
    (shouldFullReload as any).mockReturnValue(false);
    const result = decideStrategy({} as any, {
      locale: "en",
      destination: "/about",
      isExternal: false,
    });
    expect(shouldFullReload).toHaveBeenCalled();
    expect(result).toBe("client");
  });
});
