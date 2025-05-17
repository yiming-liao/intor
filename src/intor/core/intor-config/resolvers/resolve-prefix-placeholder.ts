import { DEFAULT_PREFIX_PLACEHOLDER } from "../../../constants/prefix-placeholder-constants";

export const resolvePrefixPlaceholder = (input?: string): string => {
  return input?.replace(/\//g, "") || DEFAULT_PREFIX_PLACEHOLDER;
};
