export const EXTRA_EXTS = ["md", "yaml", "toml", "json5"] as const;
export type ExtraExt = (typeof EXTRA_EXTS)[number];
