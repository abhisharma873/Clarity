import type { NumerologyMeaning } from "./types";

export const MEANINGS: Record<number, NumerologyMeaning> = {
  1: {
    strengths: "Number 1 is often linked to independence, initiative, and a willingness to lead.",
    growthAreas:
      "A growth edge here can be noticing when going it alone gets in the way of input from others.",
  },
  2: {
    strengths: "Number 2 is often linked to cooperation, patience, and sensitivity to others.",
    growthAreas:
      "A growth edge here can be building confidence to voice your own needs, not just accommodate everyone else's.",
  },
  3: {
    strengths: "Number 3 is often linked to creativity, self-expression, and communication.",
    growthAreas:
      "A growth edge here can be following through on ideas rather than scattering energy across too many at once.",
  },
  4: {
    strengths: "Number 4 is often linked to steadiness, discipline, and practical follow-through.",
    growthAreas: "A growth edge here can be staying open to new approaches when a plan stops working.",
  },
  5: {
    strengths: "Number 5 is often linked to adaptability, curiosity, and a pull toward change.",
    growthAreas: "A growth edge here can be building enough consistency to see things through.",
  },
  6: {
    strengths: "Number 6 is often linked to responsibility, care for others, and a wish for harmony.",
    growthAreas:
      "A growth edge here can be noticing when caretaking tips into over-responsibility for things that aren't yours to fix.",
  },
  7: {
    strengths: "Number 7 is often linked to reflection, analysis, and a rich inner life.",
    growthAreas:
      "A growth edge here can be staying connected to others rather than withdrawing when you need to think.",
  },
  8: {
    strengths: "Number 8 is often linked to ambition, organization, and practical competence.",
    growthAreas:
      "A growth edge here can be checking whether a drive for results is crowding out rest or relationships.",
  },
  9: {
    strengths: "Number 9 is often linked to compassion, idealism, and a pull toward the bigger picture.",
    growthAreas: "A growth edge here can be tending to your own needs as closely as you tend to others'.",
  },
  11: {
    strengths: "Number 11 is a master number often linked to heightened intuition and insight.",
    growthAreas:
      "A growth edge here can be grounding that sensitivity with rest and routine so it doesn't become overwhelming.",
  },
  22: {
    strengths:
      "Number 22 is a master number often linked to combining big vision with practical, step-by-step execution.",
    growthAreas:
      "A growth edge here can be pacing yourself — not every goal needs to be built at full scale right away.",
  },
  33: {
    strengths:
      "Number 33 is a master number often linked to a strong pull toward nurturing, teaching, and supporting others.",
    growthAreas: "A growth edge here can be making sure your own well-being isn't the last thing on the list.",
  },
};

export function getMeaning(value: number): NumerologyMeaning {
  const meaning = MEANINGS[value];
  if (!meaning) {
    throw new Error(`No numerology meaning is defined for ${value}.`);
  }
  return meaning;
}
