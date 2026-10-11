import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = fileURLToPath(new URL("../", import.meta.url));
const cwd = mkdtempSync(path.join(tmpdir(), "intor-cli-minimum-"));
const write = (name, content) => writeFileSync(path.join(cwd, name), content);
function run(args, status = 0) {
  const result = spawnSync(
    process.execPath,
    [path.join(packageDir, "bin/intor.mjs"), ...args],
    {
      cwd,
      env: { ...process.env, PATH: path.dirname(process.execPath) },
      encoding: "utf8",
      timeout: 30_000,
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, status, result.stdout + result.stderr);
  return result;
}
try {
  symlinkSync(
    path.join(packageDir, "node_modules"),
    path.join(cwd, "node_modules"),
    "junction",
  );
  write("package.json", JSON.stringify({ private: true, type: "module" }));
  write(
    "helper.ts",
    'export const messages: Record<string, string> = {hello: "Hello {name}"};',
  );
  write(
    "config.ts",
    'import {defineIntorConfig} from "intor"; import {messages} from "./helper"; export const config = defineIntorConfig({id: "minimum-node", defaultLocale: "en", supportedLocales: ["en"], messages: {en: messages}});',
  );
  write(
    "reader.ts",
    'import fs from "node:fs/promises"; import type {MessagesReader} from "intor"; const reader: MessagesReader = async (file) => JSON.parse(await fs.readFile(file, "utf8")); export default reader;',
  );
  write("messages.custom", '{"customKey": "Custom {value}"}');
  write(
    "tsconfig.json",
    JSON.stringify({
      compilerOptions: {
        module: "ESNext",
        moduleResolution: "Bundler",
        target: "ES2022",
      },
      include: ["config.ts", "helper.ts", "reader.ts"],
    }),
  );
  assert.match(run(["--help"]).stdout, /generate/);
  assert.ok(run(["--version"]).stdout.includes(`node-${process.version}`));
  assert.match(
    run(["discover", "--debug"]).stdout,
    /resolved config minimum-node/,
  );
  run([
    "generate",
    "--message-file",
    "messages.custom",
    "--reader",
    "custom=./reader.ts",
  ]);
  const schema = JSON.parse(
    readFileSync(path.join(cwd, ".intor/schema.json"), "utf8"),
  );
  assert.equal(
    schema.entries[0].shapes.messages.properties.customKey.type,
    "string",
  );
  run(["validate", "--format", "json", "--output", "validate.json"]);
  assert.deepEqual(
    JSON.parse(readFileSync(path.join(cwd, "validate.json"), "utf8")),
    { "minimum-node": {} },
  );
  run(["check", "--format", "json", "--output", "check.json"]);
  assert.deepEqual(
    JSON.parse(readFileSync(path.join(cwd, "check.json"), "utf8")),
    { configs: [{ id: "minimum-node", diagnostics: [] }] },
  );
  assert.match(
    run(["generate", "--message-file", "a", "--message-files", "web=b"], 1)
      .stderr,
    /Cannot use --message-file/,
  );
  console.log(`CLI minimum runtime checks pass on ${process.version}`);
} finally {
  rmSync(cwd, { recursive: true, force: true });
}
