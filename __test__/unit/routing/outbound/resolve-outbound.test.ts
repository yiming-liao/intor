/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { decideStrategy } from "../../../../src/routing/outbound/decide-strategy";
import { determineTarget } from "../../../../src/routing/outbound/determine-target";
import { resolveOutbound } from "../../../../src/routing/outbound/resolve-outbound";

vi.mock("../../../../src/routing/outbound/determine-target", () => ({
  determineTarget: vi.fn(),
}));

vi.mock("../../../../src/routing/outbound/decide-strategy", () => ({
  decideStrategy: vi.fn(),
}));

describe("resolveOutbound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls determineTarget with correct arguments", () => {
    (determineTarget as any).mockReturnValue({
      locale: "en",
      destination: "/about",
      isExternal: false,
    });
    (decideStrategy as any).mockReturnValue("navigate");
    const config = {} as any;
    resolveOutbound(config, "en", "/home", { destination: "/about" });
    expect(determineTarget).toHaveBeenCalledWith(config, "en", "/home", {
      destination: "/about",
    });
  });

  it("calls decideStrategy with resolved target", () => {
    const mockTarget = {
      locale: "en",
      destination: "/about",
      isExternal: false,
    };
    (determineTarget as any).mockReturnValue(mockTarget);
    (decideStrategy as any).mockReturnValue("redirect");
    resolveOutbound({} as any, "en", "/home", {});
    expect(decideStrategy).toHaveBeenCalledWith(expect.anything(), mockTarget);
  });

  it("returns correct OutboundResult structure", () => {
    (determineTarget as any).mockReturnValue({
      locale: "zh",
      destination: "/zh/about",
      isExternal: false,
    });
    (decideStrategy as any).mockReturnValue("navigate");
    const result = resolveOutbound({} as any, "en", "/home", { locale: "zh" });
    expect(result).toEqual({
      locale: "zh",
      destination: "/zh/about",
      kind: "navigate",
    });
  });
});
