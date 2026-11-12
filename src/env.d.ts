/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	/** Re-applies the stored/system theme. Defined inline in Layout.astro. */
	applyTheme?: () => void;
}
