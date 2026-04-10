/* eslint-disable @typescript-eslint/consistent-type-imports */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { start } from "../../../../src/cli/menu/menu";
import { VERSION } from "../../../../src/cli/version";
import { check, discover, generate, validate } from "../../../../src/features";

const {
  selectMock,
  introMock,
  outroMock,
  isCancelMock,
  checkPromptMock,
  discoverPromptMock,
  generatePromptMock,
  validatePromptMock,
} = vi.hoisted(() => ({
  selectMock: vi.fn(),
  introMock: vi.fn(),
  outroMock: vi.fn(),
  isCancelMock: vi.fn(() => false),
  checkPromptMock: vi.fn(),
  discoverPromptMock: vi.fn(),
  generatePromptMock: vi.fn(),
  validatePromptMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  intro: introMock,
  outro: outroMock,
  select: selectMock,
  isCancel: isCancelMock,
}));

vi.mock("../../../../src/features", () => ({
  discover: vi.fn(),
  check: vi.fn(),
  generate: vi.fn(),
  validate: vi.fn(),
}));

vi.mock("../../../../src/shared", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../../src/shared")>();

  return {
    ...actual,
    bold: vi.fn((value: string) => value),
    italic: vi.fn((value: string) => value),
  };
});

vi.mock("../../../../src/cli/version", () => ({
  VERSION: "0.0.21-test",
}));

vi.mock("../../../../src/cli/menu/check", () => ({
  checkPrompt: checkPromptMock,
}));

vi.mock("../../../../src/cli/menu/discover", () => ({
  discoverPrompt: discoverPromptMock,
}));

vi.mock("../../../../src/cli/menu/generate", () => ({
  generatePrompt: generatePromptMock,
}));

vi.mock("../../../../src/cli/menu/validate", () => ({
  validatePrompt: validatePromptMock,
}));

describe("start", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
    isCancelMock.mockReturnValue(false);
  });

  it("exits when the action selection is cancelled", async () => {
    const exitError = new Error("exit");
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => {
      throw exitError;
    }) as never);
    selectMock.mockResolvedValue(Symbol("cancel"));
    isCancelMock.mockReturnValue(true);

    await expect(start()).rejects.toThrow(exitError);
    expect(outroMock).toHaveBeenCalledWith("Exited");

    exitSpy.mockRestore();
  });

  it("exits when the exit action is selected", async () => {
    const exitError = new Error("exit");
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => {
      throw exitError;
    }) as never);
    selectMock.mockResolvedValue("exit");

    await expect(start()).rejects.toThrow(exitError);
    expect(outroMock).toHaveBeenCalledWith("Exited");

    exitSpy.mockRestore();
  });

  it("runs the discover feature from the menu", async () => {
    selectMock.mockResolvedValue("discover");
    discoverPromptMock.mockResolvedValue({ debug: true });
    vi.mocked(discover).mockResolvedValue(undefined);

    await start();

    expect(discover).toHaveBeenCalledWith({ debug: true });
  });

  it("runs the check feature from the menu", async () => {
    selectMock.mockResolvedValue("check");
    checkPromptMock.mockResolvedValue({ format: "json" });
    vi.mocked(check).mockResolvedValue(undefined);

    await start();

    expect(check).toHaveBeenCalledWith({ format: "json" });
  });

  it("runs the generate feature with the tool version", async () => {
    selectMock.mockResolvedValue("generate");
    generatePromptMock.mockResolvedValue({ debug: true });
    vi.mocked(generate).mockResolvedValue(undefined);

    await start();

    expect(generate).toHaveBeenCalledWith({
      debug: true,
      toolVersion: VERSION,
    });
  });

  it("runs the validate feature from the menu", async () => {
    selectMock.mockResolvedValue("validate");
    validatePromptMock.mockResolvedValue({ format: "human" });
    vi.mocked(validate).mockResolvedValue(undefined);

    await start();

    expect(validate).toHaveBeenCalledWith({ format: "human" });
  });

  it("prints a clean error when a feature throws", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    selectMock.mockResolvedValue("discover");
    discoverPromptMock.mockResolvedValue({ debug: true });
    vi.mocked(discover).mockRejectedValue(new Error("boom"));

    await start();

    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints non-Error failures from a feature", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    selectMock.mockResolvedValue("discover");
    discoverPromptMock.mockResolvedValue({ debug: true });
    vi.mocked(discover).mockRejectedValue("boom");

    await start();

    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });
});
