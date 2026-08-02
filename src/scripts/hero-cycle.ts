// Crossfades each hero column through its own stack of photos on a timer,
// staggered slightly per column so they don't all change in lockstep.
// Skipped under reduced motion — the first slide in each column stays put.

function initHeroCycle() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const columns = document.querySelectorAll<HTMLElement>('[data-hero-col]');

	columns.forEach((col, colIndex) => {
		const slides = col.querySelectorAll<HTMLElement>('.hero__slide');
		if (slides.length < 2) return;

		let index = 0;
		setInterval(
			() => {
				slides[index].classList.remove('is-active');
				index = (index + 1) % slides.length;
				slides[index].classList.add('is-active');
			},
			4200 + colIndex * 700,
		);
	});
}

initHeroCycle();
