import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCalendar } from "./calendar.ts";

const spans = (year: number) => {
	const { monthLabels, weeks } = buildCalendar(year);
	return monthLabels.map((m, i) => (monthLabels[i + 1]?.column ?? weeks) - m.column);
};

// Expected values taken from GitHub's own contribution table (thead colspans).
test("matches GitHub month spans when Jan 1 is a Saturday (2022)", () => {
	assert.deepEqual(spans(2022), [6, 4, 4, 4, 5, 4, 5, 4, 4, 5, 4, 4]);
});

test("matches GitHub month spans in a leap year starting Monday (2024)", () => {
	assert.deepEqual(spans(2024), [5, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5]);
});

test("matches GitHub month spans when Jan 1 is a Thursday (2026)", () => {
	assert.deepEqual(spans(2026), [5, 4, 5, 4, 5, 4, 4, 5, 4, 4, 5, 4]);
});

test("first column starts on the weekday of Jan 1 and weeks cover the year", () => {
	const cal = buildCalendar(2026);
	assert.equal(cal.offset, 4); // Thursday, Sunday = 0
	assert.equal(cal.weeks, 53);
	assert.equal(cal.monthLabels[0].column, 0);
});

test("leap year starting on Saturday needs 54 week columns", () => {
	const cal = buildCalendar(2028);
	assert.equal(cal.offset, 6);
	assert.equal(cal.weeks, 54);
});
