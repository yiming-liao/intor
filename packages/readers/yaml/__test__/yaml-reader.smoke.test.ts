import { describe, it, expect } from "vitest";
import { yamlReader } from "../index";

describe("yamlReader (smoke)", () => {
  it("parses yaml content into Messages", async () => {
    const fakeReadFile = async () => `
title: Coding is fun
meta:
  description: Writing code can be enjoyable.
tags:
  - coding
  - fun
`;

    const result = await (yamlReader as any)(
      "/fake/path/article.yaml",
      fakeReadFile,
    );

    expect(result).toEqual({
      title: "Coding is fun",
      meta: {
        description: "Writing code can be enjoyable.",
      },
      tags: ["coding", "fun"],
    });
  });
});
