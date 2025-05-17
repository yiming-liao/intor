import type { ResolvedTranslatorOptions } from "../core/intor-config/types/translator-options-types";
import {
  DEFAULT_LOADING_MESSAGE,
  DEFAULT_PLACEHOLDER,
} from "../core/intor-translator/intor-translator-constants";

// Default translator options
export const DEFAULT_TRANSLATOR_OPTIONS: ResolvedTranslatorOptions = {
  loadingMessage: DEFAULT_LOADING_MESSAGE,
  placeholder: DEFAULT_PLACEHOLDER,
};
