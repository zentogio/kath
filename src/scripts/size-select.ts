import { products, productImage, formatPrice } from '../data/products';

let activeProductId: string | null = null;
let activeSize: string | null = null;
let qty = 1;

function updateConfirmState() {
	const confirmBtn = document.querySelector<HTMLButtonElement>('[data-size-confirm]');
	if (!confirmBtn) return;
	confirmBtn.disabled = !activeSize;
	confirmBtn.textContent = activeSize ? `Add to Cart — Qty ${qty}` : 'Select a Size';
}

function updateQtyDisplay() {
	const el = document.querySelector('[data-size-qty-value]');
	if (el) el.textContent = String(qty);
	updateConfirmState();
}

function resetDialog() {
	activeSize = null;
	qty = 1;
	document
		.querySelectorAll<HTMLElement>('[data-size-option]')
		.forEach((btn) => btn.classList.remove('is-selected'));
	updateQtyDisplay();
}

function openSizeSelect(productId: string) {
	const product = products.find((p) => p.id === productId);
	if (!product) return;

	activeProductId = productId;
	resetDialog();

	const dialog = document.querySelector<HTMLDialogElement>('[data-size-dialog]');
	const image = document.querySelector<HTMLImageElement>('[data-size-image]');
	const name = document.querySelector<HTMLElement>('[data-size-name]');
	const price = document.querySelector<HTMLElement>('[data-size-price]');

	if (image) {
		image.src = productImage(product.image);
		image.alt = product.alt;
	}
	if (name) name.textContent = product.name;
	if (price) price.textContent = formatPrice(product.price);

	dialog?.showModal();
}

function initSizeSelect() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-size-dialog]');
	if (!dialog) return;

	// Intercepts every [data-add-to-cart] trigger site-wide (product cards,
	// quickview) — the actual add only happens once a size and quantity are
	// confirmed here, not on this first click.
	document.addEventListener('click', (event) => {
		const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-add-to-cart]');
		if (!trigger || (trigger as HTMLButtonElement).disabled) return;
		event.preventDefault();
		openSizeSelect(trigger.dataset.addToCart as string);
	});

	dialog.querySelectorAll<HTMLElement>('[data-size-option]').forEach((btn) => {
		btn.addEventListener('click', () => {
			dialog
				.querySelectorAll('[data-size-option]')
				.forEach((b) => b.classList.remove('is-selected'));
			btn.classList.add('is-selected');
			activeSize = btn.dataset.sizeOption as string;
			updateConfirmState();
		});
	});

	dialog.querySelector('[data-size-qty-increase]')?.addEventListener('click', () => {
		qty += 1;
		updateQtyDisplay();
	});

	dialog.querySelector('[data-size-qty-decrease]')?.addEventListener('click', () => {
		qty = Math.max(1, qty - 1);
		updateQtyDisplay();
	});

	dialog.querySelector('[data-size-confirm]')?.addEventListener('click', () => {
		if (!activeProductId || !activeSize) return;
		window.dispatchEvent(
			new CustomEvent('cart:add', { detail: { id: activeProductId, size: activeSize, qty } }),
		);
		dialog.close();
	});

	dialog.querySelector('[data-size-close]')?.addEventListener('click', () => dialog.close());

	dialog.addEventListener('click', (event) => {
		const panel = dialog.querySelector('.size-dialog__panel');
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

initSizeSelect();
