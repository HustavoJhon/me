/**
 * Year of an ISO date string (YYYY-MM-DD) without timezone conversion.
 * `new Date("2024-01-01").getFullYear()` returns 2023 west of UTC.
 */
export function yearOf(date: string): number {
	return Number(date.slice(0, 4));
}
