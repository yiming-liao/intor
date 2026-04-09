import { beforeEach, describe, expect, it, vi } from "vitest";
import { cac } from "cac";
import { generate } from "../../../../src/features";
import { registerGenerateCommand } from "../../../../src/cli/commands/generate";
import { VERSION } from "../../../../src/cli/version";

vi.mock("../../../../src/features", () => ({
  discover: vi.fn(),
  check: vi.fn(),
  generate: vi.fn(),
  validate: vi.fn(),
}));

function getAction() {
  const cli = cac("intor");
  registerGenerateCommand(cli);
  const command = cli.commands.find((item) => item.name === "generate");

  if (!command?.commandAction) {
    throw new Error("Generate command action not found.");
  }

  return command.commandAction as (options: Record<string, unknown>) => Promise<void>;
}

describe("registerGenerateCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it("forwards normalized options to the generate feature", async () => {
    const action = getAction();

    await action({
      debug: true,
      messageFiles: ["web=messages/web.json"],
      ext: ["md"],
      reader: ["md=./reader-md.ts"],
    });

    expect(generate).toHaveBeenCalledWith({
      debug: true,
      messageSource: {
        mode: "mapping",
        files: {
          web: "messages/web.json",
        },
      },
      exts: ["md"],
      customReaders: {
        md: "./reader-md.ts",
      },
      toolVersion: VERSION,
    });
    expect(process.exitCode).toBeUndefined();
  });

  it("prints a clean error when message file options conflict", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await action({
      messageFile: "messages.json",
      messageFiles: ["web=messages/web.json"],
    });

    expect(generate).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      "Cannot use --message-file and --message-files at the same time.",
    );
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints a clean error when the generate feature throws", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(generate).mockRejectedValue(new Error("generate failed"));

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("generate failed");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints non-Error failures from the generate feature", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(generate).mockRejectedValue("boom");

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });
});
