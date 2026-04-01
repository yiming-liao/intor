/**
 * Intor Translator — The Intor translation engine
 *
 * @packageDocumentation
 */

// translator
export {
  // base-translator
  BaseTranslator,
  type BaseTranslatorOptions,

  // core-translator
  CoreTranslator,
  type CoreTranslatorOptions,

  // scope-translator
  ScopeTranslator as Translator,
  type ScopeTranslatorOptions as TranslatorOptions,
  type ScopeTranslatorMethods as TranslatorMethods,
} from "../src/translators";

// pipeline
export type {
  // types
  TranslateContext,
  TranslateHook,

  // translate config
  TranslateConfig,
  TranslateHandlers,
  FormatHandler,
  LoadingHandler,
  MissingHandler,
  HandlerContext,
} from "../src/pipeline";

// message
export {
  // render-rich-message
  renderRichMessage,

  // render
  type Renderer,

  // ast
  type ASTNode,
  type TextNode,
  type TagNode,
  type RawNode,

  // types
  type Attributes,
} from "../src/message";

// formatter
export type { IntlFormatter } from "../src/formatter";

// types
export type {
  // locale
  Locale,
  FallbackLocalesMap,

  // messages
  MessagePrimitive,
  MessageArray,
  MessageObject,
  MessageValue,
  MessageLeaf,
  LocaleMessages,

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
} from "../src/types";
