/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderOverrides } from "../../../../src/features/generate/render-overrides";
import { createLogger } from "../../../../src/shared";
import { br, cyan, dim, gray } from "../../../../src/shared";

vi.mock("../../../../src/shared", () => ({
  createLogger: vi.fn(),
  br: vi.fn(),
  cyan: vi.fn((value: string) => value),
  dim: vi.fn((value: string) => value),
  gray: vi.fn((value: string) => value),
}));

describe("renderOverrides", () => {
  const logger = {
    header: vi.fn(),
    log: vi.fn(),
    footer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createLogger).mockReturnValue(logger as any);
  });

  it("does nothing when rendering is disabled", () => {
    renderOverrides("web", [], false);

    expect(createLogger).not.toHaveBeenCalled();
    expect(br).not.toHaveBeenCalled();
  });

  it("does nothing when no printable overrides are found", () => {
    renderOverrides("web", [
      {
        kind: "override",
        layer: "clientOverServer",
        path: "home.title",
        prev: 1,
        next: 2,
      } as any,
    ]);

    expect(logger.header).not.toHaveBeenCalled();
    expect(br).not.toHaveBeenCalled();
  });

  it("renders grouped overrides and truncates previews", () => {
    renderOverrides("web", [
      {
        kind: "override",
        layer: "clientOverServer",
        path: "greeting",
        prev: "Hey there before",
        next: "Hello there after",
      } as any,
      {
        kind: "override",
        layer: "runtimeOverStatic",
        path: "home.title",
        prev: "Previous title value",
        next: "Next title value",
      } as any,
      {
        kind: "merge",
        layer: "clientOverServer",
        path: "ignored",
      } as any,
    ]);

    expect(cyan).toHaveBeenCalledWith("web");
    expect(logger.header).toHaveBeenCalledWith("Overrides for web", {
      lineBreakAfter: 1,
    });
    expect(gray).toHaveBeenCalledWith("client > server");
    expect(gray).toHaveBeenCalledWith("runtime > static");
    expect(dim).toHaveBeenCalledWith("| Prev: ");
    expect(dim).toHaveBeenCalledWith(" → Next: ");
    expect(logger.log).toHaveBeenCalledWith(
      "  - greeting | Prev: Hey there before → Next: Hello there afte…",
    );
    expect(logger.log).toHaveBeenCalledWith(
      "  - home.title | Prev: Previous title v… → Next: Next title value",
    );
    expect(logger.footer).toHaveBeenCalledWith("", { lineBreakBefore: 1 });
    expect(br).toHaveBeenCalledTimes(1);
  });

  it("renders only runtime overrides without a spacer line", () => {
    renderOverrides("web", [
      {
        kind: "override",
        layer: "runtimeOverStatic",
        path: "home.title",
        prev: 123,
        next: "Next title value",
      } as any,
    ]);

    expect(logger.log).toHaveBeenCalledWith("runtime > static");
    expect(logger.log).toHaveBeenCalledWith(
      "  - home.title | Prev:  → Next: Next title value",
    );

    const plainBreakCalls = logger.log.mock.calls.filter(
      ([message]) => message === undefined,
    );
    expect(plainBreakCalls).toHaveLength(0);
  });

  it("renders only client overrides and keeps the spacer line", () => {
    renderOverrides("web", [
      {
        kind: "override",
        layer: "clientOverServer",
        path: "greeting",
        prev: "Hey",
        next: "Hello",
      } as any,
    ]);

    expect(logger.log).toHaveBeenCalledWith("client > server");
    expect(logger.log).toHaveBeenCalledWith(
      "  - greeting | Prev: Hey → Next: Hello",
    );

    const plainBreakCalls = logger.log.mock.calls.filter(
      ([message]) => message === undefined,
    );
    expect(plainBreakCalls).toHaveLength(1);
  });
});
