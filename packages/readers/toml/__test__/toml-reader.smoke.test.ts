import { describe, it, expect } from "vitest";
import { tomlReader } from "../index";

describe("tomlReader (smoke)", () => {
  it("parses toml content into Messages", async () => {
    const fakeReadFile = async () => `
title = "Coding is fun"
tags = ["coding", "fun"]

[meta]
description = "Writing code can be enjoyable."
`;

    const result = await (tomlReader as any)(
      "/fake/path/article.toml",
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
