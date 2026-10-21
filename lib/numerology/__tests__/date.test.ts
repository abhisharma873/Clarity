import { describe, expect, it } from "vitest";
import { birthdayNumber, lifePath, parseDateOfBirth } from "../date";

describe("lifePath", () => {
  it("computes the given example date", () => {
    // 1990-07-15: month reduce(7)=7, day reduce(15)=1+5=6,
    // year reduce(1990)=1+9+9+0=19 -> 1+9=10 -> 1+0=1
    // sum = 7+6+1=14 -> reduce(14)=1+4=5
    expect(lifePath("1990-07-15")).toBe(5);
  });

  it("hand-verified case: month hits a master number directly", () => {
    // 1985-11-23: month reduce(11)=11 (master, untouched since 11 itself
    // stops the loop), day reduce(23)=2+3=5,
    // year reduce(1985)=1+9+8+5=23 -> 2+3=5
    // sum = 11+5+5=21 -> reduce(21)=2+1=3
    expect(lifePath("1985-11-23")).toBe(3);
  });

  it("accepts a leap day and computes it correctly", () => {
    // 2000-02-29 (valid leap day, 2000 is divisible by 400):
    // month reduce(2)=2, day reduce(29)=2+9=11 (master),
    // year reduce(2000)=2+0+0+0=2
    // sum = 2+11+2=15 -> reduce(15)=1+5=6
    expect(lifePath("2000-02-29")).toBe(6);
  });

  it("rejects a non-leap-year Feb 29", () => {
    // 2001 is not a leap year, so Feb has only 28 days.
    expect(() => lifePath("2001-02-29")).toThrow();
  });

  it("rejects a malformed date string", () => {
    expect(() => lifePath("1990/07/15")).toThrow();
  });

  it("rejects an invalid month", () => {
    expect(() => lifePath("1990-13-01")).toThrow();
  });

  it("rejects an invalid day for the given month", () => {
    expect(() => lifePath("1990-02-30")).toThrow();
  });

  it("rejects a future date", () => {
    expect(() => lifePath("2099-01-01")).toThrow();
  });
});

describe("birthdayNumber", () => {
  it("reduces the day of month", () => {
    // 15 -> 1+5=6
    expect(birthdayNumber("1990-07-15")).toBe(6);
  });

  it("hand-verified case: keeps a master-number birthday", () => {
    // day 22 -> reduce(22)=22 (master, direct)
    expect(birthdayNumber("1975-05-22")).toBe(22);
  });
});

describe("parseDateOfBirth", () => {
  it("returns the numeric parts for a valid date", () => {
    expect(parseDateOfBirth("1990-07-15")).toEqual({ year: 1990, month: 7, day: 15 });
  });
});
