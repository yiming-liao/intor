import { formatTimestamp } from "../../../../../src/intor/core/intor-logger/write-log/utils/format-timestamp";

describe("formatTimestamp", () => {
  jest.spyOn(console, "warn").mockImplementation(() => {});

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return formatted local time when no timeZone is provided", () => {
    const date = new Date("2025-05-11T14:30:00Z"); // UTC
    const localTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const result = formatTimestamp(undefined, date);
    expect(result).toBe(localTime);
  });

  it("should return formatted time with a specific valid timeZone", () => {
    const date = new Date("2025-05-11T14:30:00Z"); // UTC

    const expected = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/New_York",
    }).format(date);

    const result = formatTimestamp("America/New_York", date);
    expect(result).toBe(expected);
  });

  it("should fallback to local time when an invalid timeZone is provided", () => {
    const date = new Date("2025-05-11T14:30:00Z");

    const localTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const result = formatTimestamp("Invalid/Zone", date);
    expect(result).toBe(localTime);
  });
});
