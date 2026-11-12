import { daysInYear, isoDayOfYear, jan1Weekday } from "./dates.ts";

export interface MonthLabel {
	/** 0-based month. */
	month: number;
	/** 0-based week column where the label starts. */
	column: number;
}

export interface CalendarLayout {
	year: number;
	/** Empty slots before Jan 1 in the first column (Sunday = 0). */
	offset: number;
	weeks: number;
	monthLabels: MonthLabel[];
}

/**
 * GitHub-style layout: one column per week (Sunday → Saturday). A column belongs to the month of its
 * first in-year day, which reproduces the month spans GitHub renders in its contribution table.
 */
export function buildCalendar(year: number): CalendarLayout {
	const offset = jan1Weekday(year);
	const total = daysInYear(year);
	const weeks = Math.ceil((offset + total) / 7);

	const monthLabels: MonthLabel[] = [];
	for (let column = 0; column < weeks; column++) {
		const firstDayIndex = Math.max(0, column * 7 - offset);
		const month = Number(isoDayOfYear(year, firstDayIndex).slice(5, 7)) - 1;
		if (monthLabels.at(-1)?.month !== month) monthLabels.push({ month, column });
	}

	return { year, offset, weeks, monthLabels };
}
