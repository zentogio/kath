import { products, productImage, productName, formatPrice } from '../data/products';
import { getLang, onLangChange } from '../i18n/state';
import { t } from '../i18n/dict';

export interface CartLine {
	id: string;
	size: string;
	qty: number;
}

const STORAGE_KEY = 'studio-kath-cart';

function readCart(): CartLine[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(line): line is CartLine =>
				typeof line?.id === 'string' &&
				typeof line?.size === 'string' &&
				typeof line?.qty === 'number' &&
				line.qty > 0,
		);
	} catch {
		return [];
	}
}

function writeCart(cart: CartLine[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
	window.dispatchEvent(new CustomEvent('cart:change', { detail: { cart } }));
}

// Same product in a different size is a different line — matched on both
// id and size, not id alone.
function addToCart(id: string, size: string, qty: number) {
	const cart = readCart();
	const existing = cart.find((line) => line.id === id && line.size === size);
	if (existing) {
		existing.qty += qty;
	} else {
		cart.push({ id, size, qty });
	}
	writeCart(cart);
}

function setQty(id: string, size: string, qty: number) {
	let cart = readCart();
	if (qty <= 0) {
		cart = cart.filter((line) => !(line.id === id && line.size === size));
	} else {
		const existing = cart.find((line) => line.id === id && line.size === size);
		if (existing) existing.qty = qty;
	}
	writeCart(cart);
}

function cartCount(cart: CartLine[]): number {
	return cart.reduce((sum, line) => sum + line.qty, 0);
}

function cartTotal(cart: CartLine[]): number {
	return cart.reduce((sum, line) => {
		const product = products.find((p) => p.id === line.id);
		return product ? sum + product.price * line.qty : sum;
	}, 0);
}

function renderBadge(cart: CartLine[]) {
	const badges = document.querySelectorAll<HTMLElement>('[data-cart-count]');
	const count = cartCount(cart);
	badges.forEach((badge) => {
		badge.textContent = String(count);
		badge.hidden = count === 0;
	});
}

function renderDrawer(cart: CartLine[]) {
	const list = document.querySelector<HTMLElement>('[data-cart-list]');
	const empty = document.querySelector<HTMLElement>('[data-cart-empty]');
	const footer = document.querySelector<HTMLElement>('[data-cart-footer]');
	const totalEl = document.querySelector<HTMLElement>('[data-cart-total]');
	if (!list || !empty || !footer || !totalEl) return;

	list.innerHTML = '';

	if (cart.length === 0) {
		empty.hidden = false;
		footer.hidden = true;
		return;
	}

	empty.hidden = true;
	footer.hidden = false;
	totalEl.textContent = formatPrice(cartTotal(cart));

	const lang = getLang();
	const sizeLabel = t('cart.size', lang);
	const removeLabel = t('cart.remove', lang);
	const decreaseLabel = t('sizeDialog.decreaseAria', lang);
	const increaseLabel = t('sizeDialog.increaseAria', lang);

	for (const line of cart) {
		const product = products.find((p) => p.id === line.id);
		if (!product) continue;
		const name = productName(product, lang);

		const item = document.createElement('li');
		item.className = 'cart-line';
		item.innerHTML = `
			<img class="cart-line__image" src="${productImage(product.image)}" alt="" width="72" height="90" loading="lazy" />
			<div class="cart-line__body">
				<p class="cart-line__name">${name}</p>
				<p class="cart-line__price">${formatPrice(product.price)} &middot; ${sizeLabel} ${line.size}</p>
				<div class="cart-line__qty" role="group" aria-label="${name}, ${sizeLabel} ${line.size}">
					<button type="button" class="cart-line__step" data-qty-decrease="${product.id}" data-qty-size="${line.size}" aria-label="${decreaseLabel}">&minus;</button>
					<span class="cart-line__qty-value" aria-live="polite">${line.qty}</span>
					<button type="button" class="cart-line__step" data-qty-increase="${product.id}" data-qty-size="${line.size}" aria-label="${increaseLabel}">&plus;</button>
				</div>
			</div>
			<button type="button" class="cart-line__remove" data-remove="${product.id}" data-remove-size="${line.size}" aria-label="${removeLabel}">${removeLabel}</button>
		`;
		list.appendChild(item);
	}
}

function render() {
	const cart = readCart();
	renderBadge(cart);
	renderDrawer(cart);
}

function initCartInteractions() {
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;

		const increase = target.closest<HTMLElement>('[data-qty-increase]');
		if (increase) {
			const id = increase.dataset.qtyIncrease as string;
			const size = increase.dataset.qtySize as string;
			const cart = readCart();
			const line = cart.find((l) => l.id === id && l.size === size);
			setQty(id, size, (line?.qty ?? 0) + 1);
			return;
		}

		const decrease = target.closest<HTMLElement>('[data-qty-decrease]');
		if (decrease) {
			const id = decrease.dataset.qtyDecrease as string;
			const size = decrease.dataset.qtySize as string;
			const cart = readCart();
			const line = cart.find((l) => l.id === id && l.size === size);
			setQty(id, size, (line?.qty ?? 1) - 1);
			return;
		}

		const remove = target.closest<HTMLElement>('[data-remove]');
		if (remove) {
			setQty(remove.dataset.remove as string, remove.dataset.removeSize as string, 0);
			return;
		}
	});

	window.addEventListener('cart:change', render as EventListener);

	// Cart is stored per-tab context but shared across pages via localStorage;
	// keep tabs in sync if the cart changes elsewhere.
	window.addEventListener('storage', (event) => {
		if (event.key === STORAGE_KEY) render();
	});

	// The size-select dialog performs the actual add — it dispatches this
	// once the customer confirms a size and quantity.
	window.addEventListener('cart:add', ((event: CustomEvent<{ id: string; size: string; qty: number }>) => {
		const { id, size, qty } = event.detail;
		addToCart(id, size, qty);
	}) as EventListener);
}

function initCartDrawer() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-cart-dialog]');
	const openTriggers = document.querySelectorAll<HTMLElement>('[data-cart-open]');
	const closeTriggers = dialog?.querySelectorAll<HTMLElement>('[data-cart-close]');

	if (!dialog) return;

	openTriggers.forEach((trigger) => {
		trigger.addEventListener('click', () => {
			dialog.showModal();
		});
	});

	closeTriggers?.forEach((trigger) => {
		trigger.addEventListener('click', () => dialog.close());
	});

	dialog.addEventListener('click', (event) => {
		const rect = dialog.getBoundingClientRect();
		const inDialog =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;
		if (!inDialog) dialog.close();
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

render();
initCartInteractions();
initCartDrawer();
onLangChange(render);
