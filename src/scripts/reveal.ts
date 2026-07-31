// Enhances already-visible content with an entrance transition; never gates
// visibility (see [data-reveal] base state in global.css), so content is
// present even if this script fails to run or IntersectionObserver is absent.

function initReveal() {
	if (!('IntersectionObserver' in window)) return;

	const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
	if (targets.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
	);

	targets.forEach((target, index) => {
		if (target.closest('[data-reveal-group]')) {
			target.style.setProperty('--i', String(index % 8));
		}
		observer.observe(target);
	});
}

initReveal();
