import type { MessageObject } from "intor-translator";
import { deepMerge } from "../../utils/deep-merge";
import { nestObjectFromPath } from "../utils/nest-object-from-path";

/**
 * Resolve remote message resources into a single MessageObject.
 *
 * - Applies semantic nesting based on resource path
 * - Merges all resolved message chunks
 *
 * Always returns a MessageObject.
 * An empty object represents an empty translation domain.
 */
export function resolveRemoteResources(
  resources: { path: string[]; data?: MessageObject }[],
): MessageObject {
  let result: MessageObject = {};

  for (const { path, data } of resources) {
    if (!data) continue;

    const resolved = path.length > 0 ? nestObjectFromPath(path, data) : data;
    result = deepMerge(result, resolved);
  }

  return result;
}
