import { parseContributionsHtml } from "./parse.ts";
import type { YearContributions } from "./types.ts";

export interface FetchOptions {
	timeoutMs?: number;
	fetchImpl?: typeof fetch;
}

/** Downloads and validates one calendar year. Throws on network, HTTP or data errors. */
export async function fetchYear(username: string, year: number, { timeoutMs = 8000, fetchImpl = fetch }: FetchOptions = {}): Promise<YearContributions> {
	const url = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`;
	const res = await fetchImpl(url, {
		signal: AbortSignal.timeout(timeoutMs),
		headers: { "User-Agent": "portfolio-contributions-sync", Accept: "text/html" },
	});
	if (!res.ok) throw new Error(`GitHub responded ${res.status} for ${year}`);
	return parseContributionsHtml(await res.text(), year);
}
