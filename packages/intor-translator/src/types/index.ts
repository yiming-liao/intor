// locale
export type { Locale, FallbackLocalesMap } from "./locale";

// messages
export type {
  MessagePrimitive,
  MessageArray,
  MessageObject,
  MessageValue,
  MessageLeaf,
  LocaleMessages,
} from "./messages";

// generics
export type {
  // key
  Key,
  LocalizedKey,
  ScopedKey,

  // pre-key
  PreKey,
  LocalizedPreKey,

  // replacement
  Replacement,
  LocalizedReplacement,
  ScopedReplacement,

  // rich
  Rich,
  LocalizedRich,
  ScopedRich,

  // value
  Value,
  LocalizedValue,
  ScopedValue,

  // utils
  IsAny,
  IsNever,
  IsRuntime,
  IfMessageObject,
  IfLocaleMessages,
  DepthDecrement,
  ExpandPath,
  GeneratePaths,
  AtPath,
} from "./generics";
