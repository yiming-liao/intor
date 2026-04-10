import { describe, expect, it } from "vitest";
import { formatSummary } from "../../../../../src/cli/menu/utils/format-summary";

describe("formatSummary", () => {
  it("renders summary rows line by line", () => {
    expect(
      formatSummary([
        ["debug", "on"],
        ["format", "json"],
      ]),
    ).toBe("debug: on\nformat: json");
  });
});
