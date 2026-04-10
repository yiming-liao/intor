export const FORMAT = ["human", "json"] as const;
export type Format = (typeof FORMAT)[number];
