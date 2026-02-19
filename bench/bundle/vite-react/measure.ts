/* eslint-disable unicorn/no-process-exit */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist", "assets");

if (!fs.existsSync(distDir)) {
  console.error("Dist folder not found. Did you run vite build?");
  process.exit(1);
}

function gzipSize(buffer: Buffer) {
  return zlib.gzipSync(buffer).length;
}

function readFileSize(file: string) {
  const content = fs.readFileSync(file);
  return {
    raw: content.length,
    gzip: gzipSize(content),
  };
}

function format(bytes: number) {
  return (bytes / 1024).toFixed(2) + " KB";
}

const files = fs.readdirSync(distDir);

type Result = {
  file: string;
  raw: number;
  gzip: number;
};

const results: Record<string, Result> = {};

for (const file of files) {
  if (!file.endsWith(".js")) continue;

  const fullPath = path.join(distDir, file);
  const size = readFileSize(fullPath);

  if (file.startsWith("baseline")) {
    results.baseline = { file, ...size };
  } else if (file.startsWith("core")) {
    results.core = { file, ...size };
  } else if (file.startsWith("react")) {
    results.react = { file, ...size };
  }
}

console.log("\nBundle Results:\n");

for (const key of Object.keys(results)) {
  const r = results[key];
  console.log(
    `${r.file.padEnd(25)} raw: ${format(r.raw)} | gzip: ${format(r.gzip)}`,
  );
}

if (!results.baseline) {
  console.warn("\nBaseline not found. Cannot compute increments.");
  process.exit(0);
}

console.log("\nIncrement Analysis:\n");

for (const key of ["core", "react"]) {
  const r = results[key];
  if (!r) continue;

  const rawDiff = r.raw - results.baseline.raw;
  const gzipDiff = r.gzip - results.baseline.gzip;

  console.log(
    `intor/${key.padEnd(10)} + raw: ${format(rawDiff)} | + gzip: ${format(gzipDiff)}`,
  );
}

console.log("");
