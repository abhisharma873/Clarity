import { describe, expect, it } from "vitest";
import { letterValue } from "../letter-values";

const PYTHAGOREAN_TABLE: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const CHALDEAN_TABLE: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

describe("letterValue — pythagorean", () => {
  it("matches the full A-Z table", () => {
    for (const [letter, expected] of Object.entries(PYTHAGOREAN_TABLE)) {
      expect(letterValue(letter, "pythagorean")).toBe(expected);
    }
  });
});

describe("letterValue — chaldean", () => {
  it("matches the full A-Z table", () => {
    for (const [letter, expected] of Object.entries(CHALDEAN_TABLE)) {
      expect(letterValue(letter, "chaldean")).toBe(expected);
    }
  });

  it("never maps a letter to 9", () => {
    for (const letter of Object.keys(CHALDEAN_TABLE)) {
      expect(letterValue(letter, "chaldean")).not.toBe(9);
    }
  });
});

describe("letterValue — invalid input", () => {
  it("rejects anything that isn't a single A-Z character", () => {
    expect(() => letterValue("1", "pythagorean")).toThrow();
    expect(() => letterValue("ab", "pythagorean")).toThrow();
    expect(() => letterValue("a", "pythagorean")).toThrow();
  });
});
