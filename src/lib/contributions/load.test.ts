import { test } from "node:test";
import assert from "node:assert/strict";
import { loadContributions } from "./load.ts";
import type { StoredSnapshot, StoredYear } from "./snapshot.ts";
import { daysInYear } from "./dates.ts";

const storedYear = (year: number, perDay = 0): StoredYear => {
	const n = daysInYear(year);
	return {
		year,
		total: perDay * n,
		fetchedAt: `${year}-06-01T00:00:00.000Z`,
		counts: new Array(n).fill(perDay),
		levels: (perDay ? "1" : "0").repeat(n),
	};
};

const snapshot: StoredSnapshot = { username: "someone", years: [storedYear(2025, 1), storedYear(2024)] };
const silent = () => {};
const failingFetch = (async () => {
	throw new Error("network down");
}) as unknown as typeof fetch;

test("falls back to the snapshot when GitHub is unreachable, keeping its date", async () => {
	const logs: string[] = [];
	const data = await loadContributions(snapshot, { currentYear: 2025, fetchImpl: failingFetch, log: (m) => logs.push(m) });
	assert.deepEqual(data.years.map((y) => [y.year, y.source]), [[2025, "snapshot"], [2024, "snapshot"]]);
	assert.equal(data.years[0].fetchedAt, "2025-06-01T00:00:00.000Z");
	assert.match(logs[0], /network down/);
});

test("does not invent a current year that is missing from the snapshot", async () => {
	const data = await loadContributions(snapshot, { currentYear: 2026, fetchImpl: failingFetch, log: silent });
	assert.deepEqual(data.years.map((y) => y.year), [2025, 2024]);
});

test("skips snapshot years that fail validation", async () => {
	const broken = { ...storedYear(2023, 2), total: 1 };
	const data = await loadContributions({ ...snapshot, years: [...snapshot.years, broken] }, { refresh: false, log: silent });
	assert.deepEqual(data.years.map((y) => y.year), [2025, 2024]);
});

test("treats HTTP errors and invalid HTML as failures", async () => {
	const rateLimited = (async () => new Response("slow down", { status: 429 })) as typeof fetch;
	const garbage = (async () => new Response("<html>login</html>", { status: 200 })) as typeof fetch;
	for (const fetchImpl of [rateLimited, garbage]) {
		const data = await loadContributions(snapshot, { currentYear: 2025, fetchImpl, log: silent });
		assert.equal(data.years[0].source, "snapshot");
	}
});

test("works offline without touching the network", async () => {
	const data = await loadContributions(snapshot, { refresh: false, fetchImpl: failingFetch, log: () => assert.fail("should not log") });
	assert.equal(data.years.length, 2);
});
