import fg from "fast-glob";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { globFiles } from "../../../src/infrastructure/glob-files";

vi.mock("fast-glob", () => ({
  default: vi.fn(),
}));

describe("globFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses default patterns/ignore/cwd when no options are provided", async () => {
    const cwdSpy = vi.spyOn(process, "cwd").mockReturnValue("/repo");
    vi.mocked(fg).mockResolvedValueOnce([]);
    const result = await globFiles();
    expect(result).toEqual([]);
    expect(fg).toHaveBeenCalledTimes(1);
    expect(fg).toHaveBeenCalledWith(["**/*.{ts,js}"], {
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.d.ts",
        "**/*.test.*",
        "**/*.test-d.ts",
      ],
      cwd: "/repo",
    });
    cwdSpy.mockRestore();
  });

  it("passes through custom options to fast-glob", async () => {
    vi.mocked(fg).mockResolvedValueOnce(["src/b.ts", "src/a.ts"]);
    await globFiles({
      patterns: ["src/**/*.{ts,tsx}"],
      ignore: ["**/*.spec.ts"],
      cwd: "/custom",
    });
    expect(fg).toHaveBeenCalledTimes(1);
    expect(fg).toHaveBeenCalledWith(["src/**/*.{ts,tsx}"], {
      ignore: ["**/*.spec.ts"],
      cwd: "/custom",
    });
  });

  it("returns results in sorted order", async () => {
    vi.mocked(fg).mockResolvedValueOnce(["z.ts", "a.ts", "m.ts", "a.ts"]);
    const result = await globFiles({
      patterns: ["**/*.ts"],
      ignore: [],
      cwd: "/repo",
    });
    expect(result).toEqual(["a.ts", "a.ts", "m.ts", "z.ts"]);
  });

  it("rethrows errors from fast-glob", async () => {
    const error = new Error("glob failed");
    vi.mocked(fg).mockRejectedValueOnce(error);
    await expect(globFiles()).rejects.toThrow("glob failed");
  });
});
