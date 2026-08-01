// Drives a continuous, real scroll-linked reveal for [data-scroll-progress]
// elements (Home's product column) via a CSS custom property — works in
// every browser, unlike native `animation-timeline`. Progress runs 0→1 as
// the element rises from the bottom half of the viewport toward its middle,
// and reverses cleanly if the user scrolls back up, matching how a native
// scroll timeline behaves. Skipped under reduced motion; the element's CSS
// default (--progress: 1) keeps it fully visible with no JS.

function initScrollProgress() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const items = document.querySelectorAll<HTMLElement>('[data-scroll-progress]');
	if (items.length === 0) return;

	let ticking = false;

	function update() {
		const viewportHeight = window.innerHeight;
		items.forEach((item) => {
			const rect = item.getBoundingClientRect();
			const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * 0.5)));
			item.style.setProperty('--progress', String(progress));
		});
		ticking = false;
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}

	update();
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
}

initScrollProgress();
