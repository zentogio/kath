// Continuous scroll-linked reveal for [data-scroll-reveal] — sets --progress
// (0→1) on every scroll frame as the element rises through the lower half
// of the viewport. Pure JS, not native animation-timeline, so it works in
// every browser rather than only the ones that support scroll-driven CSS
// animations. --progress defaults to 1 (fully in place) so content is
// correct before the script runs or if it's disabled.

// Below this width the scroll-tied fade feels sluggish on a short phone
// viewport — items just snap straight to visible instead.
const MOBILE_WIDTH = 700;

function initScatterReveal() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const items = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
	if (items.length === 0) return;

	if (window.innerWidth < MOBILE_WIDTH) {
		items.forEach((item) => item.style.setProperty('--progress', '1'));
		return;
	}

	let ticking = false;

	function update() {
		const viewportHeight = window.innerHeight;
		items.forEach((item) => {
			const rect = item.getBoundingClientRect();
			const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * 0.55)));
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

initScatterReveal();
