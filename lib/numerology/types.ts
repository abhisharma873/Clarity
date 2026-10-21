export type NumerologySystem = "pythagorean" | "chaldean";

/** ISO date-only string, e.g. "1990-07-15". Never parsed via `new Date(...)` — see date.ts. */
export type DateOfBirth = string;

export type SoulUrgeOptions = {
  /** Treat Y as a vowel. Defaults to false (Y is a consonant). */
  yAsVowel?: boolean;
};

export type NumerologyMeaning = {
  strengths: string;
  growthAreas: string;
};

export type NumerologyNumber = {
  value: number;
  meaning: NumerologyMeaning;
};

export type NumerologyChart = {
  system: NumerologySystem;
  lifePath: NumerologyNumber;
  birthdayNumber: NumerologyNumber;
  destiny: NumerologyNumber;
  soulUrge: NumerologyNumber;
  personality: NumerologyNumber;
};
