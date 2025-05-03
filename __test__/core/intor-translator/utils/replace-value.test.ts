import type { Replacement } from "@/intor/types/message-structure-types";
import { replaceValues } from "@/intor/core/intor-translator/utils/replace-values";
import { mockMessage } from "test/mock/messages.mock";

describe("replaceValues", () => {
  it("should return the same message if params is not provided", () => {
    const result = replaceValues(mockMessage);
    expect(result).toBe(mockMessage);
  });

  it("should return the same message if params is an empty object", () => {
    const result = replaceValues(mockMessage, {});
    expect(result).toBe(mockMessage);
  });

  it("should replace placeholders with corresponding values", () => {
    const params: Replacement = {
      user: {
        profile: {
          name: "Alice",
        },
        notifications: {
          count: 5,
        },
        activity: {
          lastLogin: {
            date: "2024-04-27",
            time: "10:30 AM",
          },
        },
      },
    };

    const result = replaceValues(mockMessage, params);
    expect(result).toBe(
      "Hello, Alice. You have 5 new messages. Your last login was 2024-04-27 at 10:30 AM.",
    );
  });

  it("should return the original message if some placeholders have no corresponding values", () => {
    const params: Replacement = {
      user: {
        profile: {
          name: "Alice",
        },
        // notifications is missing
        activity: {
          lastLogin: {
            date: "2024-04-27",
            time: "10:30 AM",
          },
        },
      },
    };

    const result = replaceValues(mockMessage, params);
    expect(result).toBe(
      "Hello, Alice. You have {user.notifications.count} new messages. Your last login was 2024-04-27 at 10:30 AM.",
    );
  });

  it("should return the original message if params is invalid (null or undefined)", () => {
    const result1 = replaceValues(mockMessage, null as unknown as undefined);
    const result2 = replaceValues(mockMessage, undefined);
    expect(result1).toBe(mockMessage);
    expect(result2).toBe(mockMessage);
  });

  it("should handle replacements with different data types", () => {
    const params: Replacement = {
      user: {
        profile: {
          name: "Bob",
        },
        notifications: {
          count: "ten", // String instead of number
        },
        activity: {
          lastLogin: {
            date: "yesterday",
            time: "9:00 PM",
          },
        },
      },
    };

    const result = replaceValues(mockMessage, params);
    expect(result).toBe(
      "Hello, Bob. You have ten new messages. Your last login was yesterday at 9:00 PM.",
    );
  });

  it("should not replace if a key contains invalid characters", () => {
    const params: Replacement = {
      user: {
        profile: {
          name: "Charlie",
        },
      },
    };
    const invalidMessage = "Hello, {user#profile#name}.";
    const result = replaceValues(invalidMessage, params);
    expect(result).toBe(invalidMessage); // No replacement should occur
  });
});
