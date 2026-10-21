import { describe, expect, it } from "vitest";
import { birthdayNumber, lifePath } from "../date";
import { getChart } from "../chart";
import { getMeaning } from "../meanings";
import { destiny, personality, soulUrge } from "../name";

describe("getChart", () => {
  it("matches each individually-computed number and attaches its meaning", () => {
    const fullName = "JOHN";
    const dateOfBirth = "1990-07-15";
    const system = "pythagorean";

    const chart = getChart(fullName, dateOfBirth, system);

    expect(chart.system).toBe(system);

    expect(chart.lifePath.value).toBe(lifePath(dateOfBirth));
    expect(chart.lifePath.meaning).toEqual(getMeaning(lifePath(dateOfBirth)));

    expect(chart.birthdayNumber.value).toBe(birthdayNumber(dateOfBirth));
    expect(chart.birthdayNumber.meaning).toEqual(getMeaning(birthdayNumber(dateOfBirth)));

    expect(chart.destiny.value).toBe(destiny(fullName, system));
    expect(chart.destiny.meaning).toEqual(getMeaning(destiny(fullName, system)));

    expect(chart.soulUrge.value).toBe(soulUrge(fullName, system));
    expect(chart.soulUrge.meaning).toEqual(getMeaning(soulUrge(fullName, system)));

    expect(chart.personality.value).toBe(personality(fullName, system));
    expect(chart.personality.meaning).toEqual(getMeaning(personality(fullName, system)));
  });

  it("works for the chaldean system too", () => {
    const chart = getChart("JOHN", "1990-07-15", "chaldean");
    expect(chart.system).toBe("chaldean");
    expect(chart.destiny.value).toBe(destiny("JOHN", "chaldean"));
  });
});

describe("getMeaning", () => {
  it("throws for a value with no defined meaning", () => {
    expect(() => getMeaning(0)).toThrow();
    expect(() => getMeaning(10)).toThrow();
  });

  it("returns a meaning for every valid numerology number", () => {
    for (const value of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) {
      const meaning = getMeaning(value);
      expect(meaning.strengths.length).toBeGreaterThan(0);
      expect(meaning.growthAreas.length).toBeGreaterThan(0);
    }
  });
});
