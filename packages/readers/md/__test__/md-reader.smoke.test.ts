import { describe, it, expect } from "vitest";
import { mdReader } from "../index";

describe("mdReader (smoke)", () => {
  it("reads markdown content into Messages", async () => {
    const fakeReadFile = async () => `
# Coding is fun

Writing code can be enjoyable.
`;

    const result = await (mdReader as any)(
      "/fake/path/article.md",
      fakeReadFile,
    );

    expect(result).toEqual({
      __intor_kind: "markdown",
      content: `
# Coding is fun

Writing code can be enjoyable.
`.trimStart(),
    });
  });
});
