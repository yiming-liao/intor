import { describe, it, expect } from "vitest";
import { loadLocalMessages } from "@/server/messages/load-local-messages/load-local-messages";

// __test__/mocks/messages
// ├── en-US
// │   ├── auth
// │   │   ├── index.json
// │   │   └── sign-up.json
// │   ├── index.json
// │   └── ui.json
// └── zh-TW
//     ├── auth
//     │   ├── index.json
//     │   └── sign-up.json
//     ├── index.json
//     └── ui.json
//

describe("loadLocalMessages (smoke)", () => {
  it("loads and parses local messages end-to-end", async () => {
    const result = await loadLocalMessages({
      id: "test",
      rootDir: "__test__/mocks/messages",
      locale: "en-US",
      loggerOptions: { id: "test" },
    });

    expect(result).toEqual({
      "en-US": {
        hello: "world", // index.json
        nested: { key: "value" }, // index.json
        ui: { confirm: "Confirm" }, // ui.json
        auth: {
          "sign-in": "Sign In", // auth/index.json
          "sign-up": { email: "Email" }, // auth/sign-up.json
        },
      },
    });
  });
});
