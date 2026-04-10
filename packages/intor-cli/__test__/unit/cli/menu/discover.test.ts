import { beforeEach, describe, expect, it, vi } from "vitest";
import { discoverPrompt } from "../../../../src/cli/menu/discover";
import { debugOption } from "../../../../src/cli/menu/options";

const { noteMock } = vi.hoisted(() => ({
  noteMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  note: noteMock,
}));

vi.mock("../../../../src/cli/menu/options", () => ({
  debugOption: {
    prompt: vi.fn(),
    summary: vi.fn((value: boolean) => ["debug", value ? "on" : "off"]),
  },
}));

describe("discoverPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the selected debug option and renders a summary", async () => {
    vi.mocked(debugOption.prompt).mockResolvedValue(true);

    await expect(discoverPrompt()).resolves.toEqual({
      debug: true,
    });
    expect(noteMock).toHaveBeenCalledWith("debug: on", "Discover options");
  });
});
