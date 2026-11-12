import { ContributionDataError, type ContributionLevel, type ContributionsSnapshot, type YearContributions } from "./types.ts";
import { isoDayOfYear } from "./dates.ts";
import { validateYear } from "./parse.ts";

/** On-disk shape of src/data/contributions.json (dates are implied by position). */
export interface StoredYear {
	year: number;
	total: number;
	fetchedAt: string;
	/** One count per day, Jan 1 → Dec 31. */
	counts: number[];
	/** One intensity digit (0-4) per day. */
	levels: string;
}

export interface StoredSnapshot {
	$comment?: string;
	username: string;
	years: StoredYear[];
}

export function encodeYear({ year, total, fetchedAt, days }: YearContributions): StoredYear {
	return { year, total, fetchedAt, counts: days.map((d) => d.count), levels: days.map((d) => d.level).join("") };
}

export function decodeYear(stored: StoredYear): YearContributions {
	const { year, total, fetchedAt, counts, levels } = stored;
	if (!Array.isArray(counts) || typeof levels !== "string" || counts.length !== levels.length) {
		throw new ContributionDataError(`${year}: malformed snapshot entry`);
	}
	const days = counts.map((count, i) => ({
		date: isoDayOfYear(year, i),
		count,
		level: Number(levels[i]) as ContributionLevel,
	}));
	return validateYear({ year, total, fetchedAt, days });
}

export function decodeSnapshot(stored: StoredSnapshot): ContributionsSnapshot {
	return { username: stored.username, years: stored.years.map(decodeYear) };
}
