import { describe, expect, it } from "vitest";
import { parsePlanJson, stripCodeFences } from "./parsePlan";

const VALID_JSON = JSON.stringify({
  decision: "Take the new job offer.",
  why_it_fits: ["It pays more.", "You said you're bored.", "Growth matters to you."],
  first_step: "Reply to the recruiter this week.",
  watch_out_for: "The commute might wear on you.",
  reflection_line: "You already know more than you think.",
});

describe("stripCodeFences", () => {
  it("returns plain text unchanged", () => {
    expect(stripCodeFences("hello")).toBe("hello");
  });

  it("strips a fenced block with a json language tag", () => {
    expect(stripCodeFences("```json\n{\"a\":1}\n```")).toBe('{"a":1}');
  });

  it("strips a fenced block with no language tag", () => {
    expect(stripCodeFences("```\n{\"a\":1}\n```")).toBe('{"a":1}');
  });

  it("trims surrounding whitespace", () => {
    expect(stripCodeFences("  \n{\"a\":1}\n  ")).toBe('{"a":1}');
  });
});

describe("parsePlanJson", () => {
  it("parses a valid plain JSON reply", () => {
    const plan = parsePlanJson(VALID_JSON);
    expect(plan?.decision).toBe("Take the new job offer.");
    expect(plan?.why_it_fits).toHaveLength(3);
  });

  it("parses a valid reply wrapped in code fences", () => {
    const plan = parsePlanJson(`\`\`\`json\n${VALID_JSON}\n\`\`\``);
    expect(plan?.first_step).toBe("Reply to the recruiter this week.");
  });

  it("returns null for malformed JSON", () => {
    expect(parsePlanJson("{decision: not valid json")).toBeNull();
  });

  it("returns null when a required field is missing", () => {
    const broken = JSON.parse(VALID_JSON);
    delete broken.watch_out_for;
    expect(parsePlanJson(JSON.stringify(broken))).toBeNull();
  });

  it("returns null when why_it_fits is not an array", () => {
    const broken = JSON.parse(VALID_JSON);
    broken.why_it_fits = "not an array";
    expect(parsePlanJson(JSON.stringify(broken))).toBeNull();
  });

  it("returns null when why_it_fits contains a non-string item", () => {
    const broken = JSON.parse(VALID_JSON);
    broken.why_it_fits = ["fine", 2, "also fine"];
    expect(parsePlanJson(JSON.stringify(broken))).toBeNull();
  });

  it("returns null for prose with no JSON at all", () => {
    expect(parsePlanJson("Sorry, I can't help with that.")).toBeNull();
  });
});
