// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	build: {
		// Inline all page CSS directly into the HTML instead of a separate
		// <link rel="stylesheet"> — removes the extra network round-trip that
		// was blocking first paint on throttled mobile connections (FCP/SI).
		// Trade-off: CSS can no longer be cached separately across page
		// navigations, but first-load metrics (what PageSpeed measures) win.
		inlineStylesheets: 'always',
	},
});
