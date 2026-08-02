function initMobileMenu() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-menu-dialog]');
	const openTrigger = document.querySelector<HTMLElement>('[data-menu-open]');
	const closeTriggers = dialog?.querySelectorAll<HTMLElement>('[data-menu-close]');

	if (!dialog || !openTrigger) return;

	openTrigger.addEventListener('click', () => dialog.showModal());
	closeTriggers?.forEach((trigger) => trigger.addEventListener('click', () => dialog.close()));

	dialog.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => dialog.close());
	});

	dialog.addEventListener('close', () => {
		document.documentElement.classList.remove('scroll-locked');
		window.dispatchEvent(new CustomEvent('dialog:close'));
	});

	const observer = new MutationObserver(() => {
		if (dialog.open) {
			document.documentElement.classList.add('scroll-locked');
			window.dispatchEvent(new CustomEvent('dialog:open'));
		}
	});
	observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
}

function initScrollState() {
	const nav = document.querySelector<HTMLElement>('[data-site-nav]');
	if (!nav) return;

	// Hide on the way down, reveal on the way up — but only once scrolled
	// far enough that the nav's own height is out of the way, so it never
	// hides itself out from under a user who's still right at the top.
	const hideThreshold = 72;
	let lastY = window.scrollY;

	const setState = () => {
		const y = window.scrollY;
		nav.classList.toggle('is-scrolled', y > 8);

		if (y > lastY && y > hideThreshold) {
			nav.classList.add('is-hidden');
		} else if (y < lastY) {
			nav.classList.remove('is-hidden');
		}
		lastY = y;
	};

	setState();
	window.addEventListener('scroll', setState, { passive: true });
}

function initActiveLink() {
	const path = window.location.pathname.replace(/\/$/, '') || '/';
	document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((link) => {
		const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
		if (linkPath === path) link.setAttribute('aria-current', 'page');
	});
}

initMobileMenu();
initScrollState();
initActiveLink();
