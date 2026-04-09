import { beforeEach, describe, expect, it, vi } from "vitest";
import { run } from "../../../../src/cli/menu/run";
import { VERSION } from "../../../../src/cli/version";
import { discover, generate } from "../../../../src/features";

const {
  selectMock,
  introMock,
  outroMock,
  isCancelMock,
  promptDiscoverMock,
  promptCheckMock,
  promptGenerateMock,
  promptValidateMock,
} = vi.hoisted(() => ({
  selectMock: vi.fn(),
  introMock: vi.fn(),
  outroMock: vi.fn(),
  isCancelMock: vi.fn(() => false),
  promptDiscoverMock: vi.fn(),
  promptCheckMock: vi.fn(),
  promptGenerateMock: vi.fn(),
  promptValidateMock: vi.fn(),
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

vi.mock("../../../../src/shared", () => ({
  FEATURES: {
    discover: { name: "discover", title: "Discover intor configs" },
    generate: { name: "generate", title: "Generate types & schemas" },
    check: { name: "check", title: "Check translation usages" },
    validate: { name: "validate", title: "Validate messages" },
  },
  bold: vi.fn((value: string) => value),
  italic: vi.fn((value: string) => value),
}));

vi.mock("../../../../src/cli/version", () => ({
  VERSION: "0.0.21-test",
}));

vi.mock("../../../../src/cli/menu/prompts/prompt-discover", () => ({
  promptDiscover: promptDiscoverMock,
}));

vi.mock("../../../../src/cli/menu/prompts/prompt-check", () => ({
  promptCheck: promptCheckMock,
}));

vi.mock("../../../../src/cli/menu/prompts/prompt-generate", () => ({
  promptGenerate: promptGenerateMock,
}));

vi.mock("../../../../src/cli/menu/prompts/prompt-validate", () => ({
  promptValidate: promptValidateMock,
}));

describe("run", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
    isCancelMock.mockReturnValue(false);
  });

  it("renders completed when an action succeeds", async () => {
    selectMock.mockResolvedValue("discover");
    promptDiscoverMock.mockResolvedValue({ debug: true });
    vi.mocked(discover).mockResolvedValue(undefined);

    await run();

    expect(discover).toHaveBeenCalledWith({ debug: true });
    expect(outroMock).toHaveBeenCalledWith("Completed");
    expect(process.exitCode).toBeUndefined();
  });

  it("does not render completed when an action fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    selectMock.mockResolvedValue("generate");
    promptGenerateMock.mockResolvedValue({ debug: true });
    vi.mocked(generate).mockRejectedValue(new Error("boom"));

    await run();

    expect(generate).toHaveBeenCalledWith({
      debug: true,
      toolVersion: VERSION,
    });
    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(outroMock).not.toHaveBeenCalledWith("Completed");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });
});
