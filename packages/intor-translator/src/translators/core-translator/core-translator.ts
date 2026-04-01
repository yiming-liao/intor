import type { CoreTranslatorOptions } from "./types";
import type { IntlFormatter } from "../../formatter";
import type {
  Locale,
  LocaleMessages,
  LocalizedKey,
  LocalizedValue,
  LocalizedReplacement,
  MessageValue,
} from "../../types";
import { rura } from "rura";
import { createFormatter } from "../../formatter";
import {
  DEFAULT_HOOKS,
  type TranslateConfig,
  type TranslateContext,
  type TranslateHook,
} from "../../pipeline";
import { BaseTranslator } from "../base-translator";
import { hasKey } from "../methods/has-key";
import { translate } from "../methods/translate";

/**
 * The core translator implementation.
 *
 * Implements translation behavior and pipeline execution.
 *
 * @public
 */
export class CoreTranslator<
  M = unknown,
  ReplacementShape = unknown,
> extends BaseTranslator<M> {
  /** Active translation configuration. */
  protected translateConfig: TranslateConfig<M>;
  /** Translation pipeline instance. */
  protected pipeline = rura.createPipeline<TranslateContext, MessageValue>(
    [...DEFAULT_HOOKS],
    { name: "Intor Translator" },
  );
  /** Locale-aware formatting helpers. */
  public readonly format: IntlFormatter;

  constructor(options: CoreTranslatorOptions<M>) {
    const { locale, messages, isLoading, hooks, ...translateConfig } = options;
    super({
      locale,
      ...(messages !== undefined && { messages }),
      ...(isLoading !== undefined && { isLoading }),
    });
    this.translateConfig = translateConfig;
    this.format = createFormatter({
      getLocale: () => this.locale,
    });
    if (hooks) for (const hook of hooks) this.use(hook);
  }

  /** Registers a pipeline hook. */
  public use(hook: TranslateHook) {
    this.pipeline.use(hook);
  }

  /** Logs the current hook order and execution type. */
  public logHooks() {
    this.pipeline.logHooks();
  }

  /** Returns a shallow copy of the ordered hooks. */
  public getHooks() {
    return this.pipeline.getHooks();
  }

  /** Checks whether a translation key exists. */
  public hasKey = <K extends LocalizedKey<M>>(
    key: K,
    targetLocale?: Locale<M>,
  ): boolean => {
    return hasKey({
      messages: this._messages as Readonly<LocaleMessages>,
      locale: this._locale,
      key,
      ...(targetLocale !== undefined && { targetLocale }),
    });
  };

  /** Translates a key using the configured pipeline. */
  public t = <K extends LocalizedKey<M> = LocalizedKey<M>>(
    key: K,
    replacements?: LocalizedReplacement<ReplacementShape, K>,
  ): LocalizedValue<M, K> => {
    const context: TranslateContext = {
      messages: this._messages as Readonly<LocaleMessages>,
      locale: this._locale,
      isLoading: this._isLoading,
      config: this.translateConfig,
      key,
      ...(replacements !== undefined ? { replacements: replacements } : {}),
      candidateLocales: [],
      meta: {},
    };
    return translate(this.pipeline, context) as LocalizedValue<M, K>;
  };
}
