import { beforeEach, describe, expect, it, vi } from "vitest";
import { cac } from "cac";
import { discover } from "../../../../src/features";
import { registerDiscoverCommand } from "../../../../src/cli/commands/discover";

vi.mock("../../../../src/features", () => ({
  discover: vi.fn(),
  check: vi.fn(),
  generate: vi.fn(),
  validate: vi.fn(),
}));

function getAction() {
  const cli = cac("intor");
  registerDiscoverCommand(cli);
  const command = cli.commands.find((item) => item.name === "discover");

  if (!command?.commandAction) {
    throw new Error("Discover command action not found.");
  }

  return command.commandAction as (options: Record<string, unknown>) => Promise<void>;
}

describe("registerDiscoverCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it("forwards options to the discover feature", async () => {
    const action = getAction();

    await action({
      debug: true,
    });

    expect(discover).toHaveBeenCalledWith({
      debug: true,
    });
    expect(process.exitCode).toBeUndefined();
  });

  it("prints a clean error when the discover feature throws", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(discover).mockRejectedValue(new Error("discover failed"));

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("discover failed");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });

  it("prints non-Error failures from the discover feature", async () => {
    const action = getAction();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(discover).mockRejectedValue("boom");

    await action({});

    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(process.exitCode).toBe(1);

    errorSpy.mockRestore();
  });
});
