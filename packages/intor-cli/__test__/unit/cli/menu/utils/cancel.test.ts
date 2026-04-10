import { describe, expect, it, vi } from "vitest";

const { cancelCoreMock } = vi.hoisted(() => ({
  cancelCoreMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  cancel: cancelCoreMock,
}));

describe("cancel", () => {
  it("renders the cancel message and exits the process", async () => {
    const exitError = new Error("exit");
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => {
      throw exitError;
    }) as never);

    const { cancel } = await import("../../../../../src/cli/menu/utils/cancel");

    expect(() => cancel()).toThrow(exitError);
    expect(cancelCoreMock).toHaveBeenCalledWith("Operation cancelled.");
    expect(exitSpy).toHaveBeenCalledWith(0);

    exitSpy.mockRestore();
  });
});
