import { describe, expect, it } from "vitest";
import { destiny, normalizeFullName, personality, soulUrge } from "../name";

describe("destiny", () => {
  it("matches the given example (Pythagorean JOHN)", () => {
    // J=1, O=6, H=8, N=5 -> sum=20 -> reduce(20)=2+0=2
    expect(destiny("JOHN", "pythagorean")).toBe(2);
  });

  it("hand-verified case: Chaldean JOHN differs from Pythagorean", () => {
    // Chaldean: J=1, O=7, H=5, N=5 -> sum=18 -> reduce(18)=1+8=9
    expect(destiny("JOHN", "chaldean")).toBe(9);
  });

  it("strips accents the same way as plain letters", () => {
    expect(destiny("José", "pythagorean")).toBe(destiny("JOSE", "pythagorean"));
    // J=1, O=6, S=1, E=5 -> sum=13 -> reduce(13)=1+3=4
    expect(destiny("José", "pythagorean")).toBe(4);
  });

  it("strips hyphens and apostrophes the same as a plain concatenated name", () => {
    expect(destiny("Mary-Jane", "pythagorean")).toBe(destiny("MaryJane", "pythagorean"));
    expect(destiny("O'Brien", "pythagorean")).toBe(destiny("OBrien", "pythagorean"));
  });

  it("is case-insensitive", () => {
    expect(destiny("john", "pythagorean")).toBe(destiny("JOHN", "pythagorean"));
  });

  it("ignores extra/irregular whitespace", () => {
    expect(destiny("  John   Smith  ", "pythagorean")).toBe(destiny("JohnSmith", "pythagorean"));
  });

  it("rejects an empty name", () => {
    expect(() => destiny("", "pythagorean")).toThrow();
    expect(() => destiny("   ", "pythagorean")).toThrow();
    expect(() => destiny("---'", "pythagorean")).toThrow();
  });
});

describe("soulUrge", () => {
  it("is case-insensitive", () => {
    // JOHN vowels: O only -> O=6 -> reduce(6)=6
    expect(soulUrge("john", "pythagorean")).toBe(soulUrge("JOHN", "pythagorean"));
    expect(soulUrge("JOHN", "pythagorean")).toBe(6);
  });

  it("hand-verified case: yAsVowel option changes the result", () => {
    // MARY, yAsVowel: false (default) -> only A is a vowel -> A=1 -> reduce(1)=1
    expect(soulUrge("MARY", "pythagorean")).toBe(1);
    // MARY, yAsVowel: true -> vowels A, Y -> A=1, Y=7 -> sum=8 -> reduce(8)=8
    expect(soulUrge("MARY", "pythagorean", { yAsVowel: true })).toBe(8);
  });

  it("returns 0 for a name with no vowels", () => {
    expect(soulUrge("BCDFG", "pythagorean")).toBe(0);
  });
});

describe("personality", () => {
  it("hand-verified case: consonants of JOHN", () => {
    // J=1, H=8, N=5 -> sum=14 -> reduce(14)=1+4=5
    expect(personality("JOHN", "pythagorean")).toBe(5);
  });
});

describe("normalizeFullName", () => {
  it("drops spaces, hyphens, and apostrophes", () => {
    expect(normalizeFullName("Mary-Jane O'Brien")).toEqual(
      "MARYJANEOBRIEN".split(""),
    );
  });

  it("rejects a name with no letters", () => {
    expect(() => normalizeFullName("")).toThrow();
    expect(() => normalizeFullName("   ")).toThrow();
    expect(() => normalizeFullName("-- ''")).toThrow();
  });
});
