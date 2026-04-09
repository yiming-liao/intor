import { describe, expect, it } from "vitest";
import * as utils from "../../../../src/shared/utils";
import { toRelativePath } from "../../../../src/shared/utils/to-relative-path";

describe("shared/utils exports", () => {
  it("re-exports the relative path helper", () => {
    expect(utils.toRelativePath).toBe(toRelativePath);
  });
});
