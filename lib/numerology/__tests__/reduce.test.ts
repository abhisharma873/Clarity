import { describe, expect, it } from "vitest";
import { reduceNumber } from "../reduce";

describe("reduceNumber", () => {
  it("reduces an ordinary multi-digit number to a single digit", () => {
    // 14 -> 1+4=5
    expect(reduceNumber(14)).toBe(5);
  });

  it("reduces through multiple passes", () => {
    // 1990 -> 1+9+9+0=19 -> 1+9=10 -> 1+0=1
    expect(reduceNumber(1990)).toBe(1);
  });

  it("keeps 11, 22, 33 unreduced when passed in directly", () => {
    expect(reduceNumber(11)).toBe(11);
    expect(reduceNumber(22)).toBe(22);
    expect(reduceNumber(33)).toBe(33);
  });

  it("stops at 11 when reduction reaches it", () => {
    // 29 -> 2+9=11, stop (master number)
    expect(reduceNumber(29)).toBe(11);
  });

  it("stops at 22 when reduction reaches it", () => {
    // 679 -> 6+7+9=22, stop (master number)
    expect(reduceNumber(679)).toBe(22);
  });

  it("stops at 33 when reduction reaches it", () => {
    // 6999 -> 6+9+9+9=33, stop (master number)
    expect(reduceNumber(6999)).toBe(33);
  });

  it("leaves single digits untouched", () => {
    expect(reduceNumber(7)).toBe(7);
    expect(reduceNumber(0)).toBe(0);
  });
});
