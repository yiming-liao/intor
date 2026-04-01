import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFormatter } from "../../src/formatter";
import * as createDateTimeFormatterModule from "../../src/formatter/date/create-date-time-formatter";
import * as createListFormatterModule from "../../src/formatter/list/create-list-formatter";
import * as createNumberFormatterModule from "../../src/formatter/number/create-number-formatter";
import * as createRelativeTimeFormatterModule from "../../src/formatter/relative-time/create-relative-time-formatter";

vi.mock("../../src/formatter/date/create-date-time-formatter");
vi.mock("../../src/formatter/list/create-list-formatter");
vi.mock("../../src/formatter/number/create-number-formatter");
vi.mock("../../src/formatter/relative-time/create-relative-time-formatter");

describe("createFormatter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("formats numbers with the active locale", () => {
    const format = vi.fn().mockReturnValue("1,000");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn().mockReturnValue({ format });
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });

    expect(formatter.number(1000)).toBe("1,000");
    expect(getNumberFormatter).toHaveBeenCalledWith("en-US", {});
    expect(format).toHaveBeenCalledWith(1000);
  });

  it("formats currencies with the active locale", () => {
    const format = vi.fn().mockReturnValue("$1,000.00");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn().mockReturnValue({ format });
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });

    expect(formatter.currency(1000, "USD")).toBe("$1,000.00");
    expect(getNumberFormatter).toHaveBeenCalledWith("en-US", {
      style: "currency",
      currency: "USD",
    });
    expect(format).toHaveBeenCalledWith(1000);
  });

  it("uses the latest locale from getLocale()", () => {
    let locale = "en-US";
    const format = vi
      .fn()
      .mockReturnValueOnce("1,000")
      .mockReturnValueOnce("1.000");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn().mockReturnValue({ format });
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => locale });

    expect(formatter.number(1000)).toBe("1,000");

    locale = "de-DE";

    expect(formatter.number(1000)).toBe("1.000");
    expect(getNumberFormatter).toHaveBeenNthCalledWith(1, "en-US", {});
    expect(getNumberFormatter).toHaveBeenNthCalledWith(2, "de-DE", {});
  });

  it("merges currency options while preserving the forced currency style", () => {
    const format = vi.fn().mockReturnValue("($1,234.50)");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn().mockReturnValue({ format });
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });

    expect(
      formatter.currency(-1234.5, "USD", {
        currencyDisplay: "symbol",
        currencySign: "accounting",
        signDisplay: "always",
        minimumFractionDigits: 2,
      }),
    ).toBe("($1,234.50)");

    expect(getNumberFormatter).toHaveBeenCalledWith("en-US", {
      currency: "USD",
      style: "currency",
      currencyDisplay: "symbol",
      currencySign: "accounting",
      signDisplay: "always",
      minimumFractionDigits: 2,
    });
  });

  it("formats dates with the active locale", () => {
    const value = new Date("2026-04-01T00:00:00.000Z");
    const format = vi.fn().mockReturnValue("April 1, 2026");
    const getDateTimeFormatter = vi.fn().mockReturnValue({ format });
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn();
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });

    expect(
      formatter.date(value, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
    ).toBe("April 1, 2026");
    expect(getDateTimeFormatter).toHaveBeenCalledWith("en-US", {
      dateStyle: "long",
      timeZone: "UTC",
    });
    expect(format).toHaveBeenCalledWith(value);
  });

  it("formats relative time with the active locale", () => {
    const format = vi.fn().mockReturnValue("2 hours ago");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn();
    const getRelativeTimeFormatter = vi.fn().mockReturnValue({ format });

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });

    expect(
      formatter.relativeTime(-2, "hour", {
        numeric: "always",
      }),
    ).toBe("2 hours ago");
    expect(getRelativeTimeFormatter).toHaveBeenCalledWith("en-US", {
      numeric: "always",
    });
    expect(format).toHaveBeenCalledWith(-2, "hour");
  });

  it("formats lists with the active locale", () => {
    const format = vi.fn().mockReturnValue("A, B, and C");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn().mockReturnValue({ format });
    const getNumberFormatter = vi.fn();
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });
    const values = ["A", "B", "C"];

    expect(
      formatter.list(values, {
        type: "conjunction",
        style: "long",
      }),
    ).toBe("A, B, and C");
    expect(getListFormatter).toHaveBeenCalledWith("en-US", {
      type: "conjunction",
      style: "long",
    });
    expect(format).toHaveBeenCalledWith(values);
  });

  it("merges number defaults and call-site options", () => {
    const format = vi.fn().mockReturnValue("12,345.67");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn().mockReturnValue({ format });
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({
      getLocale: () => "en-US",
      formatDefaults: {
        number: { minimumFractionDigits: 0, maximumFractionDigits: 1 },
      },
    });

    formatter.number(12345.67, {
      maximumFractionDigits: 2,
    });

    expect(getNumberFormatter).toHaveBeenCalledWith("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  });

  it("falls back to formatDefaults.currencyCode", () => {
    const format = vi.fn().mockReturnValue("$500");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn().mockReturnValue({ format });
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({
      getLocale: () => "en-US",
      formatDefaults: {
        currencyCode: "USD",
        currency: { maximumFractionDigits: 0 },
      },
    });

    expect(formatter.currency(499.9)).toBe("$500");
    expect(getNumberFormatter).toHaveBeenCalledWith("en-US", {
      maximumFractionDigits: 0,
      style: "currency",
      currency: "USD",
    });
  });

  it("throws when currency and formatDefaults.currencyCode are missing", () => {
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn();
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({ getLocale: () => "en-US" });

    expect(() => formatter.currency(1000)).toThrow(
      "[intor-translator] currency is required",
    );
  });

  it("uses formatDefaults.timeZone for date formatting", () => {
    const value = new Date("2026-04-01T00:00:00.000Z");
    const format = vi.fn().mockReturnValue("April 1, 2026");
    const getDateTimeFormatter = vi.fn().mockReturnValue({ format });
    const getListFormatter = vi.fn();
    const getNumberFormatter = vi.fn();
    const getRelativeTimeFormatter = vi.fn();

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({
      getLocale: () => "en-US",
      formatDefaults: {
        date: { dateStyle: "long" },
        timeZone: "UTC",
      },
    });

    formatter.date(value);

    expect(getDateTimeFormatter).toHaveBeenCalledWith("en-US", {
      dateStyle: "long",
      timeZone: "UTC",
    });
  });

  it("merges relative time and list defaults", () => {
    const relativeFormat = vi.fn().mockReturnValue("yesterday");
    const listFormat = vi.fn().mockReturnValue("A, B, and C");
    const getDateTimeFormatter = vi.fn();
    const getListFormatter = vi.fn().mockReturnValue({ format: listFormat });
    const getNumberFormatter = vi.fn();
    const getRelativeTimeFormatter = vi
      .fn()
      .mockReturnValue({ format: relativeFormat });

    vi.mocked(
      createDateTimeFormatterModule.createDateTimeFormatter,
    ).mockReturnValue(getDateTimeFormatter);
    vi.mocked(createListFormatterModule.createListFormatter).mockReturnValue(
      getListFormatter,
    );
    vi.mocked(
      createNumberFormatterModule.createNumberFormatter,
    ).mockReturnValue(getNumberFormatter);
    vi.mocked(
      createRelativeTimeFormatterModule.createRelativeTimeFormatter,
    ).mockReturnValue(getRelativeTimeFormatter);

    const formatter = createFormatter({
      getLocale: () => "en-US",
      formatDefaults: {
        relativeTime: { numeric: "always", style: "long" },
        list: { type: "conjunction", style: "long" },
      },
    });

    formatter.relativeTime(-1, "day", { numeric: "auto" });
    formatter.list(["A", "B", "C"], { style: "short" });

    expect(getRelativeTimeFormatter).toHaveBeenCalledWith("en-US", {
      numeric: "auto",
      style: "long",
    });
    expect(getListFormatter).toHaveBeenCalledWith("en-US", {
      type: "conjunction",
      style: "short",
    });
  });
});
