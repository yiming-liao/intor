import { describe, it, expect } from "vitest";
import { json5Reader } from "../index";

describe("json5Reader (smoke)", () => {
  it("reads JSON5 content with comments into Messages", async () => {
    const fakeReadFile = async () => `
    {
      // Title of the article
      title: "Coding is fun",

      /* Multi-line
         description */
      description: "Writing code can be enjoyable.",

      // Trailing comma is allowed
    }
    `;

    const result = await (json5Reader as any)(
      "/fake/path/messages.json5",
      fakeReadFile,
    );

    expect(result).toEqual({
      title: "Coding is fun",
      description: "Writing code can be enjoyable.",
    });
  });
});
