import Lenis from 'lenis';

declare global {
	interface Window {
		__lenis?: Lenis;
	}
}

function initSmoothScroll() {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) return;

	const lenis = new Lenis({
		duration: 1.05,
		easing: (t: number) => 1 - Math.pow(1 - t, 3),
		smoothWheel: true,
	});

	window.__lenis = lenis;

	function raf(time: number) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	// Pause the smooth-scroll loop while a modal <dialog> (cart, mobile menu)
	// is open so its own scroll region isn't fought by the page's inertia.
	window.addEventListener('dialog:open', () => lenis.stop());
	window.addEventListener('dialog:close', () => lenis.start());
}

initSmoothScroll();
