import { letterValue } from "./letter-values";
import { reduceNumber } from "./reduce";
import type { NumerologySystem, SoulUrgeOptions } from "./types";

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/**
 * Strips accents (NFD-decompose + drop combining marks), uppercases, then
 * drops everything that isn't A-Z (spaces, hyphens, apostrophes, digits).
 */
export function normalizeFullName(fullName: string): string[] {
  const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");
  const letters = fullName
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("");

  if (letters.length === 0) {
    throw new Error("Full name must contain at least one letter.");
  }

  return letters;
}

export function isVowel(letter: string, yAsVowel: boolean): boolean {
  if (letter === "Y") {
    return yAsVowel;
  }
  return VOWELS.has(letter);
}

function sumLetters(letters: string[], system: NumerologySystem): number {
  return reduceNumber(letters.reduce((total, letter) => total + letterValue(letter, system), 0));
}

export function destiny(fullName: string, system: NumerologySystem): number {
  return sumLetters(normalizeFullName(fullName), system);
}

export function soulUrge(
  fullName: string,
  system: NumerologySystem,
  options: SoulUrgeOptions = {},
): number {
  const yAsVowel = options.yAsVowel ?? false;
  const vowels = normalizeFullName(fullName).filter((letter) => isVowel(letter, yAsVowel));
  return sumLetters(vowels, system);
}

export function personality(
  fullName: string,
  system: NumerologySystem,
  options: SoulUrgeOptions = {},
): number {
  const yAsVowel = options.yAsVowel ?? false;
  const consonants = normalizeFullName(fullName).filter((letter) => !isVowel(letter, yAsVowel));
  return sumLetters(consonants, system);
}
