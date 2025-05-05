// Intor adapter
export const intorAdapters = ["next-client", "next-server"] as const;
export type IntorAdapter = (typeof intorAdapters)[number];
