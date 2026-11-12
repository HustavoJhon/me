const DAY_MS = 86_400_000;

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const daysInYear = (year: number) => (isLeapYear(year) ? 366 : 365);

/** ISO date of the n-th day (0-based) of a year, computed in UTC to avoid timezone drift. */
export const isoDayOfYear = (year: number, index: number) => new Date(Date.UTC(year, 0, 1) + index * DAY_MS).toISOString().slice(0, 10);

/** Weekday of Jan 1, Sunday = 0 (GitHub's week layout). */
export const jan1Weekday = (year: number) => new Date(Date.UTC(year, 0, 1)).getUTCDay();
