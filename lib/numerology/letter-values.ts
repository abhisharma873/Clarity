import type { NumerologySystem } from "./types";

const CHALDEAN_GROUPS: Record<number, string> = {
  1: "AIJQY",
  2: "BKR",
  3: "CGLS",
  4: "DMT",
  5: "EHNX",
  6: "UVW",
  7: "OZ",
  8: "FP",
};

const CHALDEAN_MAP: Record<string, number> = Object.entries(CHALDEAN_GROUPS).reduce(
  (map, [value, letters]) => {
    for (const letter of letters) {
      map[letter] = Number(value);
    }
    return map;
  },
  {} as Record<string, number>,
);

function pythagoreanValue(letter: string): number {
  const code = letter.charCodeAt(0) - "A".charCodeAt(0);
  return (code % 9) + 1;
}

/** `letter` must be a single uppercase A-Z character. */
export function letterValue(letter: string, system: NumerologySystem): number {
  if (!/^[A-Z]$/.test(letter)) {
    throw new Error(`letterValue expects a single A-Z character, got "${letter}".`);
  }

  if (system === "pythagorean") {
    return pythagoreanValue(letter);
  }

  return CHALDEAN_MAP[letter];
}
