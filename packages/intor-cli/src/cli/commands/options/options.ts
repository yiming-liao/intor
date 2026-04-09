import type { ExtraExt } from "../../../shared";
import type { CAC } from "cac";

export const options = {
  debug: ["--debug", "Enable debug logging", { default: false }],

  tsconfig: [
    "--tsconfig <path>",
    "Path to the tsconfig file (default: tsconfig.json)",
  ],

  messageFile: [
    "--message-file <file>",
    "Path to a message file for the default locale",
  ],

  messageFiles: [
    "--message-files <mapping>",
    "Map config IDs to message files as <configId=path> (repeatable)",
    { default: [] },
  ],

  ext: [
    "--ext <ext>",
    "Enable extra messages file extension (repeatable)",
    { default: [] },
  ],

  reader: [
    "--reader <mapping>",
    "Map file extensions to reader modules as <ext=path> (repeatable)",
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
