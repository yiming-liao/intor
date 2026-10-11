import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const entry = fileURLToPath(new URL("../../bin/intor.mjs", import.meta.url));
const nodePath = path.dirname(process.execPath);

// Use an unrelated cwd and a PATH without the workspace's tsx executable.
function run(args: string[]) {
  const cwd = mkdtempSync(path.join(tmpdir(), "intor-launcher-"));
  try {
    return spawnSync(process.execPath, [entry, ...args], {
      cwd,
      env: { ...process.env, PATH: nodePath },
      encoding: "utf8",
      timeout: 15_000,
    });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

describe("Node CLI launcher", () => {
  it("starts without a consumer tsx executable and forwards arguments", () => {
    const result = run(["generate", "--help"]);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("--message-file");
    expect(result.stdout).toContain("--reader");
  });

  it("preserves command failure exit codes", () => {
    const result = run([
      "generate",
      "--message-file",
      "a",
      "--message-files",
      "web=b",
    ]);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Cannot use --message-file and --message-files",
    );
  });
});
