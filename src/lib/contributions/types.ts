export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
	/** ISO date, YYYY-MM-DD (UTC calendar day as published by GitHub). */
	date: string;
	count: number;
	level: ContributionLevel;
}

export interface YearContributions {
	year: number;
	total: number;
	/** Every day of the year, Jan 1 → Dec 31, in order. */
	days: ContributionDay[];
	/** ISO timestamp of when this year was fetched from GitHub. */
	fetchedAt: string;
}

export interface ContributionsSnapshot {
	username: string;
	years: YearContributions[];
}

export class ContributionDataError extends Error {
	override name = "ContributionDataError";
}
