import { describe, expect, it } from "vitest";
import { findMessageInLocales } from "../../../src/shared/utils/find-message-in-locales";

const messages = {
  en: {
    auth: {
      login: {
        title: "Login",
      },
    },
  },
  fr: {
    auth: {
      login: {
        title: "Connexion",
      },
    },
  },
};

describe("findMessageInLocales", () => {
  it("should find message in the first locale", () => {
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en", "fr"],
      key: "auth.login.title",
    });
    expect(result).toBe("Login");
  });

  it("should find message in the fallback locale", () => {
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["de" as "en", "fr"],
      key: "auth.login.title",
    });
    expect(result).toBe("Connexion");
  });

  it("should return undefined if message does not exist in any locale", () => {
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en", "fr"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      key: "auth.logout.title" as any,
    });
    expect(result).toBeUndefined();
  });

  it("should return raw array value if message is an array", () => {
    const messages = {
      en: {
        steps: ["one", "two", "three"],
      },
    };
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en"],
      key: "steps",
    });
    expect(result).toEqual(["one", "two", "three"]);
  });

  it("should return null if the message exists but is explicitly null", () => {
    const messages = {
      en: {
        empty: null,
      },
    };
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en"],
      key: "empty",
    });
    expect(result).toBeNull();
  });

  it("should find flat messages whose key contains dots", () => {
    const messages = {
      en: {
        "dashboard.hello": "hello",
      },
    };
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en"],
      key: "dashboard.hello",
    });
    expect(result).toBe("hello");
  });

  it("should prefer exact key match before nested traversal", () => {
    const messages = {
      en: {
        "dashboard.hello": "flat",
        dashboard: {
          hello: "nested",
        },
      },
    };
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en"],
      key: "dashboard.hello",
    });
    expect(result).toBe("flat");
  });

  it("should find nested values under a flat dotted parent key", () => {
    const messages = {
      en: {
        "a.b": {
          c: "hello",
        },
      },
    };
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en"],
      key: "a.b.c",
    });
    expect(result).toBe("hello");
  });

  it("should find nested values under mixed dotted keys across levels", () => {
    const messages = {
      en: {
        a: {
          "b.c": {
            d: "hello",
          },
        },
      },
    };
    const result = findMessageInLocales({
      messages,
      candidateLocales: ["en"],
      key: "a.b.c.d",
    });
    expect(result).toBe("hello");
  });
});
