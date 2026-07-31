// Subtle cursor-follow displacement for CTAs marked [data-magnetic].
// Fine-pointer devices only; skipped entirely under reduced motion.

function initMagnetic() {
	const isFinePointer = window.matchMedia('(pointer: fine)').matches;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!isFinePointer || prefersReducedMotion) return;

	const targets = document.querySelectorAll<HTMLElement>('[data-magnetic]');

	targets.forEach((el) => {
		let raf = 0;
		const strength = 0.25;

		el.addEventListener('mousemove', (event) => {
			const rect = el.getBoundingClientRect();
			const x = event.clientX - rect.left - rect.width / 2;
			const y = event.clientY - rect.top - rect.height / 2;
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
			});
		});

		el.addEventListener('mouseleave', () => {
			cancelAnimationFrame(raf);
			el.style.transform = '';
		});
	});
}

initMagnetic();
