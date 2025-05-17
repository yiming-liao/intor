import type { LogMeta } from "../weite-log-types";

const formatError = (error: Error, stackLines = 3) => ({
  message: error.message,
  stack: error.stack
    ? error.stack.split("\n").slice(0, stackLines).join("\n")
    : undefined,
});

/**
 * Pretty-print log meta with error support.
 */
export const printMeta = (
  meta: LogMeta,
  metaDepth: number,
  isUseColor: boolean,
): void => {
  let output = meta;

  if (meta instanceof Error) {
    output = { error: formatError(meta) };
  } else if (
    meta &&
    typeof meta === "object" &&
    "error" in meta &&
    meta.error instanceof Error
  ) {
    const { error, ...rest } = meta;
    output = {
      ...rest,
      error: formatError(error),
    };
  }

  console.dir(output, {
    depth: metaDepth,
    colors: isUseColor,
  });
};
