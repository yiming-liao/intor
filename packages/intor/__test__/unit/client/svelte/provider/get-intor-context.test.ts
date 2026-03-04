/* eslint-disable @typescript-eslint/no-explicit-any */

import { getContext } from "svelte";
import { describe, it, expect, vi } from "vitest";
import { INTOR_CONTEXT_KEY } from "../../../../../src/client/svelte/provider/create-intor-store";
import { getIntorContext } from "../../../../../src/client/svelte/provider/get-intor-context";

vi.mock("svelte", () => ({
  getContext: vi.fn(),
}));

describe("getIntorContext (svelte)", () => {
  it("returns context when available", () => {
    (getContext as any).mockReturnValue({ test: true });
    const result = getIntorContext();
    expect(getContext).toHaveBeenCalledWith(INTOR_CONTEXT_KEY);
    expect(result).toEqual({ test: true });
  });

  it("throws when context is missing", () => {
    (getContext as any).mockReturnValue(undefined);
    expect(() => getIntorContext()).toThrow(
      "getIntorContext must be used within IntorProvider",
    );
  });
});
