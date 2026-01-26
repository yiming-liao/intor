/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { isSvelteKitSSG } from "@/adapters/svelte-kit/server/utils/is-svelte-kit-ssg";

function createEvent(headers?: Record<string, string>) {
  return {
    request: { headers: new Headers(headers) },
  } as any;
}

describe("isSvelteKitSSG", () => {
  it("returns true when user-agent header is missing (SSG / prerender)", () => {
    const event = createEvent();
    expect(isSvelteKitSSG(event)).toBe(true);
  });

  it("returns false when user-agent header is present (runtime request)", () => {
    const event = createEvent({
      "user-agent": "Mozilla/5.0",
    });
    expect(isSvelteKitSSG(event)).toBe(false);
  });
});
