import type { ParsedFileEntries } from "./types";
import type { MessageObject } from "intor-translator";
import { MessageConflictError } from "../../message-conflict-error";

/** Reject duplicate leaves and object/leaf collisions across local files. */
export function assertNoMessageConflicts(
  entries: readonly ParsedFileEntries[],
): void {
  const definitions = new Map<string, { file: string; object: boolean }[]>();
  const register = (
    messages: MessageObject,
    file: string,
    parent: string[] = [],
  ) => {
    for (const [key, value] of Object.entries(messages)) {
      const segments = [...parent, key];
      // Dotted properties and nested properties expose the same lookup key.
      // Record actual nodes only: a dotted key does not define its prefixes.
      const identity = segments.join(".");
      const object =
        value !== null && typeof value === "object" && !Array.isArray(value);
      const previous = definitions.get(identity) ?? [];
      const conflict = previous.find(
        (definition) =>
          definition.file !== file && !(definition.object && object),
      );
      if (conflict) {
        throw new MessageConflictError(identity, conflict.file, file);
      }
      previous.push({ file, object });
      definitions.set(identity, previous);
      if (object) register(value as MessageObject, file, segments);
    }
  };

  for (const { namespace, messages, fullPath } of entries) {
    register(
      namespace === "index" ? messages : { [namespace]: messages },
      fullPath,
    );
  }
}
