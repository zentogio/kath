// Crossfades each hero column through its own stack of photos on a timer,
// staggered slightly per column so they don't all change in lockstep.
// Skipped under reduced motion — the first slide in each column stays put.
//
// Inactive slides sit at opacity:0, which makes them ineligible as an LCP
// candidate — but the moment this script flips one to .is-active, it becomes
// newly eligible and (being the same size as the outgoing slide) can win and
// re-time LCP to that instant. START_DELAY keeps the first swap well clear
// of any realistic LCP measurement window so the carousel can't do that.
const START_DELAY = 10_000;
const STAGGER = 700;
const INTERVAL = 4200;

function initHeroCycle() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const columns = document.querySelectorAll<HTMLElement>('[data-hero-col]');

	columns.forEach((col, colIndex) => {
		const slides = col.querySelectorAll<HTMLElement>('.hero__slide');
		if (slides.length < 2) return;

		let index = 0;
		const advance = () => {
			slides[index].classList.remove('is-active');
			index = (index + 1) % slides.length;
			slides[index].classList.add('is-active');
		};

		setTimeout(
			() => {
				advance();
				setInterval(advance, INTERVAL);
			},
			START_DELAY + colIndex * STAGGER,
		);
	});
}

initHeroCycle();
