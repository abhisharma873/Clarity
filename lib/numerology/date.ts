import { reduceNumber } from "./reduce";
import type { DateOfBirth } from "./types";

export type ParsedDate = {
  year: number;
  month: number;
  day: number;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

/**
 * Hand-parses "YYYY-MM-DD" instead of `new Date(...)` — Date parsing is
 * timezone-sensitive and can shift the day depending on the runtime's
 * local timezone, which would silently corrupt birthdate math.
 */
export function parseDateOfBirth(dateOfBirth: DateOfBirth): ParsedDate {
  const match = DATE_PATTERN.exec(dateOfBirth);
  if (!match) {
    throw new Error(`Invalid date of birth "${dateOfBirth}". Expected format YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month ${month} in date of birth "${dateOfBirth}".`);
  }

  if (day < 1 || day > daysInMonth(year, month)) {
    throw new Error(`Invalid day ${day} for ${year}-${String(month).padStart(2, "0")}.`);
  }

  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const dobUTC = Date.UTC(year, month - 1, day);
  if (dobUTC > todayUTC) {
    throw new Error(`Date of birth "${dateOfBirth}" cannot be in the future.`);
  }

  return { year, month, day };
}

/** Reduces month, day, and year separately, then adds them and reduces again. */
export function lifePath(dateOfBirth: DateOfBirth): number {
  const { year, month, day } = parseDateOfBirth(dateOfBirth);
  const total = reduceNumber(month) + reduceNumber(day) + reduceNumber(year);
  return reduceNumber(total);
}

export function birthdayNumber(dateOfBirth: DateOfBirth): number {
  const { day } = parseDateOfBirth(dateOfBirth);
  return reduceNumber(day);
}
