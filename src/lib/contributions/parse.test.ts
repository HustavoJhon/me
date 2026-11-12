import { test } from "node:test";
import assert from "node:assert/strict";
import { parseContributionsHtml, ContributionDataError } from "./parse.ts";

/** Builds markup shaped like github.com/users/<user>/contributions. */
function fixture(year: number, counts: number[], totalText?: string): string {
	const start = Date.UTC(year, 0, 1);
	const offset = new Date(start).getUTCDay();
	const cells: string[] = [];
	const tips: string[] = [];
	counts.forEach((count, i) => {
		const date = new Date(start + i * 86_400_000).toISOString().slice(0, 10);
		const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / 3));
		const week = Math.floor((offset + i) / 7);
		const dow = (offset + i) % 7;
		const id = `contribution-day-component-${dow}-${week}`;
		// Attribute order deliberately varies between cells.
		cells.push(
			i % 2
				? `<td tabindex="0" data-ix="${week}" data-date="${date}" id="${id}" data-level="${level}" role="gridcell" class="ContributionCalendar-day"></td>`
				: `<td data-level="${level}" id="${id}" data-date="${date}" class="ContributionCalendar-day"></td>`,
		);
		const label = count === 0 ? "No contributions" : `${count.toLocaleString("en-US")} contribution${count === 1 ? "" : "s"}`;
		tips.push(`<tool-tip id="tooltip-${i}" for="${id}" popover="manual">${label} on some day.</tool-tip>`);
	});
	const total = totalText ?? counts.reduce((a, b) => a + b, 0).toLocaleString("en-US");
	return `<h2 tabindex="-1" id="js-contribution-activity-description" class="f4">
      ${total}
      contributions
        in ${year}
    </h2><table><tbody>${cells.join("")}</tbody></table>${tips.join("")}`;
}

const daysIn = (y: number) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 366 : 365);

test("parses totals with thousands separators (1,869 → 1869)", () => {
	const counts = Array.from({ length: 365 }, (_, i) => (i === 10 ? 1500 : i % 5 === 0 ? 3 : 0));
	const data = parseContributionsHtml(fixture(2026, counts), 2026);
	assert.equal(data.total, counts.reduce((a, b) => a + b, 0));
	assert.ok(data.total > 1000);
	assert.equal(data.days[10].count, 1500);
});

test("reads real per-day counts from tooltips, not intensity levels", () => {
	const counts = new Array(365).fill(0);
	counts[3] = 12;
	const data = parseContributionsHtml(fixture(2025, counts), 2025);
	assert.deepEqual(data.days[3], { date: "2025-01-04", count: 12, level: 4 });
	assert.equal(data.days[4].count, 0);
});

test("returns days sorted and complete for leap years", () => {
	const data = parseContributionsHtml(fixture(2024, new Array(366).fill(0)), 2024);
	assert.equal(data.days.length, 366);
	assert.equal(data.days[0].date, "2024-01-01");
	assert.equal(data.days.at(-1)!.date, "2024-12-31");
	assert.equal(data.total, 0);
});

test("rejects totals that do not match the daily sum", () => {
	const counts = new Array(daysIn(2023)).fill(1);
	assert.throws(() => parseContributionsHtml(fixture(2023, counts, "999"), 2023), ContributionDataError);
});

test("rejects incomplete calendars", () => {
	const html = fixture(2023, new Array(200).fill(0));
	assert.throws(() => parseContributionsHtml(html, 2023), /365/);
});

test("rejects markup without a total (GitHub layout change)", () => {
	assert.throws(() => parseContributionsHtml("<html>rate limited</html>", 2023), ContributionDataError);
});
