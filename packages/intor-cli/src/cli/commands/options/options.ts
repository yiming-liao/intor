import type { ExtraExt } from "../../../core";
import type { CAC } from "cac";

export const options = {
  debug: ["--debug", "Enable debug logging", { default: false }],

  tsconfig: [
    "--tsconfig <path>",
    "Path to tsconfig.json (default: tsconfig.json)",
  ],

  messageFile: [
    "--message-file <file>",
    "Explicit message file for single-config projects",
  ],

  messageFiles: [
    "--message-files <mapping>",
    "Explicit message file mapping in the form <configId=path> (repeatable)",
    { default: [] },
  ],

  ext: [
    "--ext <ext>",
    "Enable extra messages file extension (repeatable)",
    { default: [] },
  ],

  reader: [
    "--reader <mapping>",
    "Custom reader mapping in the form <ext=path> (repeatable)",
    { default: [] },
  ],

  format: [
    "--format <format>",
    "Output format: human | json",
    { default: "human" },
  ],

  output: [
    "--output <file>",
    "Write output to file (only applies to json format)",
  ],
} as const satisfies Record<string, Parameters<CAC["option"]>>;

export interface CliOptions {
  debug?: boolean;
  tsconfig?: string;
  messageFile?: string;
  messageFiles?: string | string[];
  ext?: ExtraExt | ExtraExt[];
  reader?: string | string[];
  format?: "human" | "json";
  output?: string;
}
