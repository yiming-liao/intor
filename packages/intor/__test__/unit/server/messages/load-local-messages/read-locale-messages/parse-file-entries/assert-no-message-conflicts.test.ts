import type { ParsedFileEntries } from "../../../../../../../src/server/messages/load-local-messages/read-locale-messages/parse-file-entries/types";
import { describe, expect, it } from "vitest";
import { MessageConflictError } from "../../../../../../../src/server/messages/load-local-messages/message-conflict-error";
import { assertNoMessageConflicts } from "../../../../../../../src/server/messages/load-local-messages/read-locale-messages/parse-file-entries/assert-no-message-conflicts";

const entry = (
  fullPath: string,
  namespace: string,
  messages: ParsedFileEntries["messages"],
): ParsedFileEntries => ({ fullPath, namespace, messages });

describe("assertNoMessageConflicts", () => {
  it.each([false, true])(
    "rejects dotted/nested aliases (reversed: %s)",
    (reverse) => {
      for (const value of ["Same", "Different"]) {
        const entries = [
          entry("/en/index.json", "index", { "auth.title": "Same" }),
          entry("/en/auth.json", "auth", { title: value }),
        ];
        if (reverse) entries.reverse();
        expect(() => assertNoMessageConflicts(entries)).toThrow(
          'Conflicting message "auth.title"',
        );
      }
    },
  );

  it.each([false, true])(
    "rejects dotted parent aliases (reversed: %s)",
    (reverse) => {
      const entries = [
        entry("/en/index.json", "index", { "auth.login": { title: "A" } }),
        entry("/en/auth.json", "auth", { login: { title: "B" } }),
      ];
      if (reverse) entries.reverse();
      expect(() => assertNoMessageConflicts(entries)).toThrow(
        'Conflicting message "auth.login.title"',
      );
    },
  );

  it.each([false, true])(
    "rejects dotted object/leaf aliases (reversed: %s)",
    (reverse) => {
      const entries = [
        entry("/en/index.json", "index", { "auth.login": "A" }),
        entry("/en/auth.json", "auth", { login: { title: "B" } }),
      ];
      if (reverse) entries.reverse();
      expect(() => assertNoMessageConflicts(entries)).toThrow(
        'Conflicting message "auth.login"',
      );
    },
  );

  it("does not invent intermediate objects for dotted properties", () => {
    expect(() =>
      assertNoMessageConflicts([
        entry("/en/index.json", "index", { auth: "A" }),
        entry("/en/other.json", "index", { "auth.title": "B" }),
      ]),
    ).not.toThrow();
  });

  it("allows disjoint keys under dotted and nested parents", () => {
    expect(() =>
      assertNoMessageConflicts([
        entry("/en/index.json", "index", { "auth.login": { title: "A" } }),
        entry("/en/auth.json", "auth", { login: { help: "B" } }),
      ]),
    ).not.toThrow();
  });

  it("leaves aliases within one file unchanged but detects another file's overlap", () => {
    const first = entry("/en/index.json", "index", {
      "auth.login": "Flat",
      auth: { login: { title: "Nested" } },
    });
    expect(() => assertNoMessageConflicts([first])).not.toThrow();
    expect(() =>
      assertNoMessageConflicts([
        first,
        entry("/en/auth.json", "auth", { login: { help: "Other" } }),
      ]),
    ).toThrow('Conflicting message "auth.login"');
  });
  it("rejects duplicate keys even when values are identical", () => {
    const entries = [
      entry("/messages/en/auth/index.json", "auth", { title: "Same" }),
      entry("/messages/en/auth.json", "auth", { title: "Same" }),
    ];
    let thrown: unknown;
    try {
      assertNoMessageConflicts(entries);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(MessageConflictError);
    expect(thrown).toMatchObject({
      name: "MessageConflictError",
      key: "auth.title",
      firstFile: "/messages/en/auth/index.json",
      secondFile: "/messages/en/auth.json",
    });
    expect((thrown as Error).message).toBe(
      'Conflicting message "auth.title" in "/messages/en/auth/index.json" and "/messages/en/auth.json".',
    );
  });

  it.each([false, true])(
    "rejects root index / namespace overlap (reversed: %s)",
    (reverse) => {
      const entries = [
        entry("/messages/en/index.json", "index", { auth: { title: "Root" } }),
        entry("/messages/en/auth.json", "auth", { title: "Namespace" }),
      ];
      if (reverse) entries.reverse();
      expect(() => assertNoMessageConflicts(entries)).toThrow(
        'Conflicting message "auth.title"',
      );
    },
  );

  it.each(["text", null, ["item"], 0, false])(
    "rejects an object followed by a leaf (%j)",
    (leaf) => {
      expect(() =>
        assertNoMessageConflicts([
          entry("/messages/en/auth/login.json", "auth", {
            login: { title: "Title" },
          }),
          entry("/messages/en/auth/index.json", "auth", { login: leaf }),
        ]),
      ).toThrow('Conflicting message "auth.login"');
    },
  );

  it("allows root and namespace files to contribute different nested keys", () => {
    const entries = [
      entry("/messages/en/index.json", "index", {
        auth: { login: { title: "Title" } },
      }),
      entry("/messages/en/auth/login.json", "auth", {
        login: { help: "Help" },
      }),
    ];
    const before = structuredClone(entries);
    expect(() => assertNoMessageConflicts(entries)).not.toThrow();
    expect(entries).toEqual(before);
  });
});
