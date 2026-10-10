import {
  Translator,
  type LocaleMessages,
  type Replacement,
} from "intor-translator";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createTRich as createReactTRich } from "../../src/client/react/translator/create-t-rich";
import { createTRich as createHtmlTRich } from "../../src/core/translator/create-t-rich";

function createFunctions(message: string) {
  const translator = new Translator<LocaleMessages>({
    locale: "en",
    messages: { en: { message } },
  });
  const t = (key = "message", replacements?: Replacement) =>
    translator.t(key, replacements);
  const html = createHtmlTRich(t);
  const react = createReactTRich(t);
  return {
    t,
    html,
    react,
    reactHtml: (name: string) =>
      renderToStaticMarkup(
        React.createElement(
          React.Fragment,
          null,
          ...react("message", undefined, { name }),
        ),
      ),
  };
}

// Characterization of the current interpolation-before-parsing contract.
// These cases document compatibility; they do not establish a trust policy.
describe("rich replacements across real translation and render pipelines", () => {
  it("renders a formatter's null result as empty HTML and React output", () => {
    const translator = new Translator<LocaleMessages>({
      locale: "en",
      messages: { en: { message: "Hello {name}" } },
      handlers: { formatHandler: () => null },
    });
    const t = (key = "message", replacements?: Replacement) =>
      translator.t(key, replacements);
    expect(t("message", { name: "Alice" })).toBeNull();
    expect(createHtmlTRich(t)("message", undefined, { name: "Alice" })).toBe(
      "",
    );
    expect(
      createReactTRich(t)("message", undefined, { name: "Alice" }),
    ).toEqual([]);
  });

  it("preserves message-defined tags around interpolated text", () => {
    const { html, reactHtml } = createFunctions("Hello <b>{name}</b>!");
    expect(html("message", undefined, { name: "Alice" })).toBe(
      "Hello <b>Alice</b>!",
    );
    expect(reactHtml("Alice")).toBe("Hello <b>Alice</b>!");
  });

  it("escapes plain comparison symbols and ampersands at rendering", () => {
    const { t, html, reactHtml } = createFunctions("Hello {name}!");
    const name = "2 < 3 & 5 > 4";
    expect(t("message", { name })).toBe(`Hello ${name}!`);
    expect(html("message", undefined, { name })).toBe(
      "Hello 2 &lt; 3 &amp; 5 &gt; 4!",
    );
    expect(reactHtml(name)).toBe("Hello 2 &lt; 3 &amp; 5 &gt; 4!");
  });

  it("currently parses valid replacement markup as rich structure", () => {
    const { t, html, reactHtml } = createFunctions("Hello {name}!");
    const name = "<b>Alice</b>";
    expect(t("message", { name })).toBe("Hello <b>Alice</b>!");
    expect(html("message", undefined, { name })).toBe("Hello <b>Alice</b>!");
    expect(reactHtml(name)).toBe("Hello <b>Alice</b>!");
  });

  it.each([
    ["<b>", "Unclosed tag"],
    ["</b>", "Unmatched closing tag"],
  ])("rejects malformed replacement structure %s", (name, error) => {
    const { t, html, reactHtml } = createFunctions("Hello {name}!");
    expect(t("message", { name })).toBe(`Hello ${name}!`);
    expect(() => html("message", undefined, { name })).toThrow(error);
    expect(() => reactHtml(name)).toThrow(error);
  });

  it("does not decode pre-escaped replacement entities", () => {
    const { html, reactHtml } = createFunctions("Hello {name}!");
    const name = "&lt;b&gt;Alice&lt;/b&gt;";
    const expected = "Hello &amp;lt;b&amp;gt;Alice&amp;lt;/b&amp;gt;!";
    expect(html("message", undefined, { name })).toBe(expected);
    expect(reactHtml(name)).toBe(expected);
  });

  it("interpolates template attributes in HTML while default React tags omit them", () => {
    const { html, react } = createFunctions('<a href="{url}">{name}</a>');
    const replacements = { url: "/pricing?a=1&b=2", name: "Pricing" };
    expect(html("message", undefined, replacements)).toBe(
      '<a href="/pricing?a=1&amp;b=2">Pricing</a>',
    );
    const output = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        ...react("message", undefined, replacements),
      ),
    );
    expect(output).toBe("<a>Pricing</a>");
  });
});
