import { ContributionDataError, type ContributionDay, type ContributionLevel, type YearContributions } from "./types.ts";
import { daysInYear, isoDayOfYear } from "./dates.ts";

export { ContributionDataError };

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

/** "1,869" → 1869 */
const toInt = (text: string) => Number.parseInt(text.replace(/[^\d]/g, ""), 10);

/**
 * Parses the HTML fragment served by github.com/users/<user>/contributions?from=YYYY-01-01&to=YYYY-12-31.
 * Per-day counts come from the tooltips (data-level is only an intensity bucket).
 * Throws ContributionDataError when the markup is not a complete, self-consistent year.
 */
export function parseContributionsHtml(html: string, year: number, fetchedAt = new Date().toISOString()): YearContributions {
	const totalMatch = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,.]+)\s+contributions?\b/);
	if (!totalMatch) throw new ContributionDataError(`No contribution total found for ${year}`);
	const total = toInt(totalMatch[1]);

	const tooltips = new Map<string, string>();
	for (const [, id, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
		tooltips.set(id, text.trim());
	}

	const days: ContributionDay[] = [];
	for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g)) {
		const date = attr(tag, "data-date")!;
		const level = Number(attr(tag, "data-level"));
		const tip = tooltips.get(attr(tag, "id") ?? "") ?? "";
		const countMatch = tip.match(/^([\d,.]+)\s+contributions?\b/);
		if (!countMatch && !/^No contributions\b/.test(tip)) {
			throw new ContributionDataError(`Unreadable tooltip for ${date}: "${tip}"`);
		}
		if (!Number.isInteger(level) || level < 0 || level > 4) {
			throw new ContributionDataError(`Invalid level "${level}" for ${date}`);
		}
		days.push({ date, count: countMatch ? toInt(countMatch[1]) : 0, level: level as ContributionLevel });
	}

	days.sort((a, b) => a.date.localeCompare(b.date));
	return validateYear({ year, total, days, fetchedAt });
}

/** Structural checks shared by the parser and the snapshot loader. */
export function validateYear(data: YearContributions): YearContributions {
	const { year, total, days } = data;
	const expected = daysInYear(year);
	if (days.length !== expected) {
		throw new ContributionDataError(`${year}: expected ${expected} days, got ${days.length}`);
	}
	let sum = 0;
	days.forEach((day, i) => {
		if (day.date !== isoDayOfYear(year, i)) {
			throw new ContributionDataError(`${year}: unexpected date ${day.date} at position ${i}`);
		}
		if (!Number.isInteger(day.count) || day.count < 0) {
			throw new ContributionDataError(`${year}: invalid count on ${day.date}`);
		}
		if ((day.count === 0) !== (day.level === 0)) {
			throw new ContributionDataError(`${year}: count/level mismatch on ${day.date}`);
		}
		sum += day.count;
	});
	if (sum !== total) {
		throw new ContributionDataError(`${year}: total ${total} does not match daily sum ${sum}`);
	}
	return data;
}
