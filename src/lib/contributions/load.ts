import { fetchYear, type FetchOptions } from "./github.ts";
import { decodeYear, type StoredSnapshot } from "./snapshot.ts";
import type { YearContributions } from "./types.ts";

export type ContributionSource = "live" | "snapshot";

export interface LoadedYear extends YearContributions {
	source: ContributionSource;
}

export interface LoadedContributions {
	username: string;
	/** Newest first. Years that failed validation are omitted, never invented. */
	years: LoadedYear[];
}

export interface LoadOptions extends FetchOptions {
	/** Try to refresh the current year from GitHub (default: true unless CONTRIBUTIONS_OFFLINE=1). */
	refresh?: boolean;
	currentYear?: number;
	log?: (message: string) => void;
}

/**
 * Snapshot-first loader: past years come from the committed snapshot; the current year is refreshed
 * from GitHub when possible and falls back to the snapshot (keeping its original fetchedAt) otherwise.
 */
export async function loadContributions(snapshot: StoredSnapshot, options: LoadOptions = {}): Promise<LoadedContributions> {
	const {
		refresh = process.env.CONTRIBUTIONS_OFFLINE !== "1",
		currentYear = new Date().getUTCFullYear(),
		log = (m) => console.warn(`[contributions] ${m}`),
		...fetchOptions
	} = options;

	const years = new Map<number, LoadedYear>();
	for (const entry of snapshot.years) {
		try {
			years.set(entry.year, { ...decodeYear(entry), source: "snapshot" });
		} catch (error) {
			log(`skipping invalid snapshot year ${entry.year}: ${(error as Error).message}`);
		}
	}

	if (refresh) {
		try {
			const live = await fetchYear(snapshot.username, currentYear, fetchOptions);
			years.set(currentYear, { ...live, source: "live" });
		} catch (error) {
			const fallback = years.has(currentYear) ? `using snapshot from ${years.get(currentYear)!.fetchedAt}` : "no data for this year";
			log(`could not refresh ${currentYear} (${(error as Error).message}); ${fallback}`);
		}
	}

	return {
		username: snapshot.username,
		years: [...years.values()].sort((a, b) => b.year - a.year),
	};
}

let cached: Promise<LoadedContributions> | undefined;

/** Memoized for the lifetime of the build/dev process so every page shares one request. */
export const getContributions = (snapshot: StoredSnapshot) => (cached ??= loadContributions(snapshot));
