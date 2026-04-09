import { beforeEach, describe, expect, it, vi } from "vitest";
import { toRelativePath } from "../../../../src/shared/utils/to-relative-path";

describe("toRelativePath", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a workspace-relative path", () => {
    vi.spyOn(process, "cwd").mockReturnValue("/repo");

    expect(toRelativePath("/repo/src/app.ts")).toBe("src/app.ts");
  });

  it('returns "." when the path matches the current working directory', () => {
    vi.spyOn(process, "cwd").mockReturnValue("/repo");

    expect(toRelativePath("/repo")).toBe(".");
  });
});
