import { cac } from "cac";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerValidateCommand } from "../../../../src/cli/commands/validate";
import { validate } from "../../../../src/features";

vi.mock("../../../../src/features", () => ({
  discover: vi.fn(),
  check: vi.fn(),
  generate: vi.fn(),
  validate: vi.fn(),
}));

function getAction() {
  const cli = cac("intor");
  registerValidateCommand(cli);
  const command = cli.commands.find((item) => item.name === "validate");

  if (!command?.commandAction) {
    throw new Error("Validate command action not found.");
  }

  return command.commandAction as (
    options: Record<string, unknown>,
  ) => Promise<void>;
}

describe("registerValidateCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it("forwards normalized options to the validate feature", async () => {
    const action = getAction();

    await action({
      debug: true,
      ext: ["md"],
      reader: ["md=./reader-md.ts"],
      format: "json",
      output: "report.json",
    });

    expect(validate).toHaveBeenCalledWith({
      debug: true,
      exts: ["md"],
      customReaders: {
        md: "./reader-md.ts",
      },
      format: "json",
      output: "report.json",
    });
    expect(process.exitCode).toBeUndefined();
  });

  it("prints a clean error when reader mappings are invalid", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await action({
      reader: ["broken"],
    });

    expect(validate).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      'Invalid --reader entry: "broken". Each entry must be in the form: <ext=path>',
    );
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints a clean error when the validate feature throws", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(validate).mockRejectedValue(new Error("validate failed"));

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("validate failed");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints non-Error failures from the validate feature", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(validate).mockRejectedValue("boom");

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });
});
