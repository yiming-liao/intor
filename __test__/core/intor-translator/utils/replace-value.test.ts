import { replaceValues } from "../../../../src/intor/core/intor-translator/utils/replace-values";
import { mockMessage } from "../../../mock/mock-messages";

describe("replaceValues", () => {
  it("should return the same message if params is not provided", () => {
    const result = replaceValues(mockMessage);
    expect(result).toBe(mockMessage);
  });

  it("should return the same message if params is an empty object", () => {
    const result = replaceValues(mockMessage, {});
    expect(result).toBe(mockMessage);
  });

  it("should replace a single value correctly", () => {
    const message = "Hello, {user.name}!";
    const params = { user: { name: "Alice" } };
    const result = replaceValues(message, params);
    expect(result).toBe("Hello, Alice!");
  });

  it("should replace nested values correctly", () => {
    const message = "The price is {product.details.price}";
    const params = { product: { details: { price: 100 } } };
    const result = replaceValues(message, params);
    expect(result).toBe("The price is 100");
  });

  it("should return the same message if the value is undefined in params", () => {
    const message = "Hello, {user.name}!";
    const params = { user: {} };
    const result = replaceValues(message, params);
    expect(result).toBe("Hello, {user.name}!");
  });

  it("should return the same message if the value is null in params", () => {
    const message = "Hello, {user.name}!";
    const params = { user: { name: null as unknown as string } };
    const result = replaceValues(message, params);
    expect(result).toBe("Hello, {user.name}!");
  });

  it("should return the same message if the value is a non-replaceable object", () => {
    const message = "Hello, {user.details}!";
    const params = { user: { details: { age: 30 } } };
    const result = replaceValues(message, params);
    expect(result).toBe("Hello, {user.details}!");
  });

  it("should handle case where value is a number", () => {
    const message = "The amount is {amount}";
    const params = { amount: 250 };
    const result = replaceValues(message, params);
    expect(result).toBe("The amount is 250");
  });

  it("should handle case where value is a string", () => {
    const message = "Welcome, {user.name}";
    const params = { user: { name: "Bob" } };
    const result = replaceValues(message, params);
    expect(result).toBe("Welcome, Bob");
  });

  it("should return the original match if no replacement is found", () => {
    const message = "Hello, {user.name}!";
    const params = { user: { nickname: "Charlie" } };
    const result = replaceValues(message, params);
    expect(result).toBe("Hello, {user.name}!");
  });

  it("should not replace when the value is not a string or number (e.g., object or array)", () => {
    const message = "User details: {user.details}";
    const params = { user: { details: { age: 25 } } };
    const result = replaceValues(message, params);
    expect(result).toBe("User details: {user.details}");
  });

  it("should correctly replace value with stringified number", () => {
    const message = "The year is {year}";
    const params = { year: 2025 };
    const result = replaceValues(message, params);
    expect(result).toBe("The year is 2025");
  });
});
