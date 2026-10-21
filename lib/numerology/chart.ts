import { birthdayNumber, lifePath } from "./date";
import { getMeaning } from "./meanings";
import { destiny, personality, soulUrge } from "./name";
import type { DateOfBirth, NumerologyChart, NumerologySystem } from "./types";

export function getChart(
  fullName: string,
  dateOfBirth: DateOfBirth,
  system: NumerologySystem,
): NumerologyChart {
  const lifePathValue = lifePath(dateOfBirth);
  const birthdayValue = birthdayNumber(dateOfBirth);
  const destinyValue = destiny(fullName, system);
  const soulUrgeValue = soulUrge(fullName, system);
  const personalityValue = personality(fullName, system);

  return {
    system,
    lifePath: { value: lifePathValue, meaning: getMeaning(lifePathValue) },
    birthdayNumber: { value: birthdayValue, meaning: getMeaning(birthdayValue) },
    destiny: { value: destinyValue, meaning: getMeaning(destinyValue) },
    soulUrge: { value: soulUrgeValue, meaning: getMeaning(soulUrgeValue) },
    personality: { value: personalityValue, meaning: getMeaning(personalityValue) },
  };
}
