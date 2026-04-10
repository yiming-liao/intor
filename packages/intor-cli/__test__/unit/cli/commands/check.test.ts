import { cac } from "cac";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerCheckCommand } from "../../../../src/cli/commands/check";
import { check } from "../../../../src/features";

vi.mock("../../../../src/features", () => ({
  discover: vi.fn(),
  check: vi.fn(),
  generate: vi.fn(),
  validate: vi.fn(),
}));

function getAction() {
  const cli = cac("intor");
  registerCheckCommand(cli);
  const command = cli.commands.find((item) => item.name === "check");

  if (!command?.commandAction) {
    throw new Error("Check command action not found.");
  }

  return command.commandAction as (
    options: Record<string, unknown>,
  ) => Promise<void>;
}

describe("registerCheckCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it("forwards mapped options to the check feature", async () => {
    const action = getAction();

    await action({
      debug: true,
      tsconfig: "tsconfig.app.json",
      format: "json",
      output: "report.json",
    });

    expect(check).toHaveBeenCalledWith({
      debug: true,
      tsconfigPath: "tsconfig.app.json",
      format: "json",
      output: "report.json",
    });
    expect(process.exitCode).toBeUndefined();
  });

  it("prints a clean error when the check feature throws", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(check).mockRejectedValue(new Error("check failed"));

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("check failed");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints non-Error failures from the check feature", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(check).mockRejectedValue("boom");

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });
});
