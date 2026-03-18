import type { MergeOverrides } from "../../core";
import { createLogger } from "../../logger";
import { dim, gray, br, cyan } from "../../render";

export function renderOverrides(
  configId: string,
  overrides: MergeOverrides[],
  enabled = true,
) {
  if (!enabled) return;
  const logger = createLogger();

  // Group overrides by layer
  const { clientOverServer, runtimeOverStatic } = groupOverrides(overrides);
  const hasClientOverServer = clientOverServer.length > 0;
  const hasRuntimeOverStatic = runtimeOverStatic.length > 0;
  if (!hasClientOverServer && !hasRuntimeOverStatic) return;

  // Log header
  logger.header(`Overrides for ${cyan(configId)}`, { lineBreakAfter: 1 });

  // Client overrides server
  if (hasClientOverServer) {
    logger.log(gray("client > server"));
    for (const { path, prev, next } of clientOverServer) {
      logger.log(`  - ${path} ${formatDiff(prev, next)}`);
    }
    logger.log();
  }

  // Runtime overrides static
  if (hasRuntimeOverStatic) {
    logger.log(gray("runtime > static"));
    for (const { path, prev, next } of runtimeOverStatic) {
      logger.log(`  - ${path} ${formatDiff(prev, next)}`);
    }
  }

  // Log footer
  logger.footer("", { lineBreakBefore: 1 });

  br();
}

function groupOverrides(overrides: MergeOverrides[]) {
  const groups: Record<MergeOverrides["layer"], MergeOverrides[]> = {
    clientOverServer: [],
    runtimeOverStatic: [],
  };
  for (const o of overrides) {
    const { kind, layer, prev, next } = o;
    if (kind !== "override") continue;
    if (typeof prev !== "string" && typeof next !== "string") continue;
    groups[layer].push(o);
  }
  return groups;
}

function formatDiff(prev: unknown, next: unknown) {
  return (
    dim("| Prev: ") +
    gray(truncate(prev)) +
    dim(" → Next: ") +
    gray(truncate(next))
  );
}

const MAX_PREVIEW_LENGTH = 16;
function truncate(value: unknown, max = MAX_PREVIEW_LENGTH): string {
  if (typeof value !== "string") return "";
  if (value.length <= max) return value;
  return value.slice(0, max) + "…";
}
