import { buildSearchParams } from "../../../../src/intor/core/intor-messages-loader/fetch-api-messages/build-search-params";

describe("buildSearchParams", () => {
  it("should create search params from string values", () => {
    const params = {
      basePath: "myBasePath",
      loggerId: "myLoggerId",
      locale: "en",
    };
    const result = buildSearchParams(params);
    expect(result.toString()).toBe(
      "basePath=myBasePath&loggerId=myLoggerId&locale=en",
    );
  });

  it("should handle string array values", () => {
    const params = {
      namespaces: ["namespace1", "namespace2"],
    };
    const result = buildSearchParams(params);
    expect(result.toString()).toBe(
      "namespaces=namespace1&namespaces=namespace2",
    );
  });

  it("should skip undefined or null values", () => {
    const params = {
      basePath: "myBasePath",
      loggerId: null as unknown as undefined,
      locale: undefined,
    };
    const result = buildSearchParams(params);
    expect(result.toString()).toBe("basePath=myBasePath");
  });

  it("should handle empty params gracefully", () => {
    const params = {};
    const result = buildSearchParams(params);
    expect(result.toString()).toBe("");
  });

  it("should handle mixed types of values", () => {
    const params = {
      basePath: "myBasePath",
      namespaces: ["namespace1", "namespace2"],
      loggerId: "myLoggerId",
      locale: "en",
    };
    const result = buildSearchParams(params);
    expect(result.toString()).toBe(
      "basePath=myBasePath&namespaces=namespace1&namespaces=namespace2&loggerId=myLoggerId&locale=en",
    );
  });
});
