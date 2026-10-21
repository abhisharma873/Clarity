export const MASTER_NUMBERS = [11, 22, 33] as const;

function isMasterNumber(n: number): boolean {
  return (MASTER_NUMBERS as readonly number[]).includes(n);
}

function digitSum(n: number): number {
  return String(n)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

/**
 * Sums digits repeatedly until a single digit, except master numbers
 * (11, 22, 33) are kept unreduced as soon as the running value hits one.
 */
export function reduceNumber(n: number): number {
  let value = n;
  while (value > 9 && !isMasterNumber(value)) {
    value = digitSum(value);
  }
  return value;
}
