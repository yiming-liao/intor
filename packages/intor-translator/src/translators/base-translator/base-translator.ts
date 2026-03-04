import type { BaseTranslatorOptions } from "./types";
import type { Locale, LocaleMessages } from "../../types";

/**
 * The base translator implementation.
 *
 * Manages runtime state only.
 *
 * @public
 */
export class BaseTranslator<M = unknown> {
  /** Current messages for translation */
  protected _messages: Readonly<M>;
  /** Current active locale */
  protected _locale: Locale<M>;
  /** Current loading state */
  protected _isLoading: boolean;

  constructor(options: BaseTranslatorOptions<M>) {
    this._messages = options.messages ?? ({} as M);
    this._locale = options.locale;
    this._isLoading = options.isLoading ?? false;
  }

  /** Get messages. */
  public get messages(): M {
    return this._messages;
  }

  /** Get the current active locale. */
  public get locale(): Locale<M> {
    return this._locale;
  }

  /** Get the current loading state. */
  public get isLoading(): boolean {
    return this._isLoading;
  }

  /**
   * Replace messages with new ones.
   *
   * - Note: This allows runtime setting of messages even if `M` is inferred as `never`.
   * The type cast bypasses TypeScript restrictions on dynamic messages.
   */
  public setMessages<N extends LocaleMessages>(messages: N) {
    this._messages = messages as unknown as M;
  }

  /**
   * Set the active locale.
   *
   * - Note: Unlike `setMessages`, the locale structure cannot be changed at runtime.
   */
  public setLocale(newLocale: Locale<M>): void {
    this._locale = newLocale;
  }

  /** Set the loading state. */
  public setLoading(state: boolean) {
    this._isLoading = state;
  }
}
