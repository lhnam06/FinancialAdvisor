import { Solar } from "lunar-javascript";

export type LunarInfo = {
  day: number;
  month: number;
  year: number;
  isFirstDayOfMonth: boolean;
};

/**
 * Convert a Gregorian (solar) date to its Vietnamese lunar equivalent.
 * Accepts either a Date object or an ISO date string like "2026-04-18".
 */
export function toLunar(input: Date | string): LunarInfo {
  const date = typeof input === "string" ? new Date(`${input}T00:00:00`) : input;
  const lunar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ).getLunar();

  const day = lunar.getDay();

  return {
    day,
    month: lunar.getMonth(),
    year: lunar.getYear(),
    isFirstDayOfMonth: day === 1,
  };
}

/**
 * Compact label for a lunar date shown underneath a solar day in a calendar cell.
 *   - The first day of a lunar month shows e.g. "T3" so users can spot month rollovers.
 *   - Other days show just the day number.
 */
export function formatLunarLabel(input: Date | string): string {
  const { day, month, isFirstDayOfMonth } = toLunar(input);
  return isFirstDayOfMonth ? `T${month}` : String(day);
}
