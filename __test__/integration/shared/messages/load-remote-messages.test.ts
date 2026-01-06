import { describe, it, expect, vi } from "vitest";
import { loadRemoteMessages } from "@/core";

describe("loadRemoteMessages (integration)", () => {
  it("loads and parses remote messages end-to-end", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        "en-US": {
          hello: "world",
        },
      }),
    });

    const result = await loadRemoteMessages({
      locale: "en-US",
      url: "",
      loggerOptions: { id: "test" },
    });

    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual({
      "en-US": {
        hello: "world",
      },
    });
  });
});
