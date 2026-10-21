import { describe, expect, it } from "vitest";
import { isValidDecisionType, validateEmail } from "./validate";

describe("validateEmail", () => {
  it("accepts a plain valid email", () => {
    expect(validateEmail("person@example.com")).toBe(true);
  });

  it("accepts an email with surrounding whitespace", () => {
    expect(validateEmail("  person@example.com  ")).toBe(true);
  });

  it("rejects an email with no domain", () => {
    expect(validateEmail("person@")).toBe(false);
  });

  it("rejects an email with no @", () => {
    expect(validateEmail("person.example.com")).toBe(false);
  });

  it("rejects an email with spaces", () => {
    expect(validateEmail("person @example.com")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(validateEmail("")).toBe(false);
  });
});

describe("isValidDecisionType", () => {
  it("accepts every listed decision type", () => {
    expect(isValidDecisionType("Career")).toBe(true);
    expect(isValidDecisionType("Job offer")).toBe(true);
    expect(isValidDecisionType("Moving abroad")).toBe(true);
    expect(isValidDecisionType("Studies")).toBe(true);
    expect(isValidDecisionType("Relationship")).toBe(true);
    expect(isValidDecisionType("Other")).toBe(true);
  });

  it("rejects an unlisted value", () => {
    expect(isValidDecisionType("Finances")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidDecisionType("")).toBe(false);
  });
});
