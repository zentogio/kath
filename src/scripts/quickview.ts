import { products, productImage, formatPrice } from '../data/products';

let activeImages: string[] = [];
let activeIndex = 0;

function renderImages(dialog: HTMLDialogElement) {
	const viewport = dialog.querySelector<HTMLElement>('[data-quickview-viewport]');
	const dots = dialog.querySelector<HTMLElement>('[data-quickview-dots]');
	const prevBtn = dialog.querySelector<HTMLElement>('[data-quickview-prev]');
	const nextBtn = dialog.querySelector<HTMLElement>('[data-quickview-next]');
	if (!viewport || !dots || !prevBtn || !nextBtn) return;

	viewport.innerHTML = activeImages
		.map(
			(id, i) =>
				`<img src="${productImage(id)}" alt="" class="${i === activeIndex ? 'is-active' : ''}" loading="${i === 0 ? 'eager' : 'lazy'}" />`,
		)
		.join('');

	dots.innerHTML = activeImages
		.map(
			(_, i) =>
				`<button type="button" class="quickview-dialog__dot${i === activeIndex ? ' is-active' : ''}" data-quickview-dot="${i}" aria-label="View photo ${i + 1}"></button>`,
		)
		.join('');

	const multi = activeImages.length > 1;
	prevBtn.hidden = !multi;
	nextBtn.hidden = !multi;
}

function setActiveIndex(dialog: HTMLDialogElement, index: number) {
	activeIndex = (index + activeImages.length) % activeImages.length;
	dialog.querySelectorAll<HTMLImageElement>('[data-quickview-viewport] img').forEach((img, i) => {
		img.classList.toggle('is-active', i === activeIndex);
	});
	dialog.querySelectorAll<HTMLElement>('[data-quickview-dot]').forEach((dot, i) => {
		dot.classList.toggle('is-active', i === activeIndex);
	});
}

function openQuickView(dialog: HTMLDialogElement, productId: string) {
	const product = products.find((p) => p.id === productId);
	if (!product) return;

	activeImages = [product.image, ...product.gallery];
	activeIndex = 0;
	renderImages(dialog);

	const name = dialog.querySelector<HTMLElement>('[data-quickview-name]');
	const price = dialog.querySelector<HTMLElement>('[data-quickview-price]');
	const details = dialog.querySelector<HTMLElement>('[data-quickview-details]');
	const detailsWrap = dialog.querySelector<HTMLDetailsElement>('.quickview-dialog__details-wrap');
	const badge = dialog.querySelector<HTMLElement>('[data-quickview-badge]');
	const addButton = dialog.querySelector<HTMLButtonElement>('[data-quickview-add]');
	const addLabel = addButton?.querySelector<HTMLElement>('[data-add-label]');

	if (name) name.textContent = product.name;
	if (price) price.textContent = formatPrice(product.price);
	if (details) details.textContent = product.details;
	if (detailsWrap) detailsWrap.open = false;
	if (badge) badge.hidden = !product.soldOut;
	if (addButton) {
		addButton.dataset.addToCart = product.id;
		addButton.disabled = product.soldOut;
	}
	if (addLabel) addLabel.textContent = product.soldOut ? 'Sold Out' : 'Add to Cart';

	dialog.showModal();
}

function initQuickView() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-quickview-dialog]');
	if (!dialog) return;

	document.addEventListener('click', (event) => {
		const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-quickview-open]');
		if (trigger) {
			openQuickView(dialog, trigger.dataset.quickviewOpen as string);
		}
	});

	dialog.querySelector('[data-quickview-close]')?.addEventListener('click', () => dialog.close());
	dialog
		.querySelector('[data-quickview-prev]')
		?.addEventListener('click', () => setActiveIndex(dialog, activeIndex - 1));
	dialog
		.querySelector('[data-quickview-next]')
		?.addEventListener('click', () => setActiveIndex(dialog, activeIndex + 1));

	dialog.querySelector('[data-quickview-dots]')?.addEventListener('click', (event) => {
		const dot = (event.target as HTMLElement).closest<HTMLElement>('[data-quickview-dot]');
		if (dot) setActiveIndex(dialog, Number(dot.dataset.quickviewDot));
	});

	dialog.addEventListener('click', (event) => {
		const panel = dialog.querySelector('.quickview-dialog__panel');
		if (panel && !panel.contains(event.target as Node)) dialog.close();
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

initQuickView();
