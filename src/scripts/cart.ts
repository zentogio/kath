import { products, productImage, formatPrice } from '../data/products';

interface CartLine {
	id: string;
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
				typeof line?.id === 'string' && typeof line?.qty === 'number' && line.qty > 0,
		);
	} catch {
		return [];
	}
}

function writeCart(cart: CartLine[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
	window.dispatchEvent(new CustomEvent('cart:change', { detail: { cart } }));
}

function addToCart(id: string) {
	const cart = readCart();
	const existing = cart.find((line) => line.id === id);
	if (existing) {
		existing.qty += 1;
	} else {
		cart.push({ id, qty: 1 });
	}
	writeCart(cart);
}

function setQty(id: string, qty: number) {
	let cart = readCart();
	if (qty <= 0) {
		cart = cart.filter((line) => line.id !== id);
	} else {
		const existing = cart.find((line) => line.id === id);
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

	for (const line of cart) {
		const product = products.find((p) => p.id === line.id);
		if (!product) continue;

		const item = document.createElement('li');
		item.className = 'cart-line';
		item.innerHTML = `
			<img class="cart-line__image" src="${productImage(product.image)}" alt="" width="72" height="90" loading="lazy" />
			<div class="cart-line__body">
				<p class="cart-line__name">${product.name}</p>
				<p class="cart-line__price">${formatPrice(product.price)}</p>
				<div class="cart-line__qty" role="group" aria-label="Quantity for ${product.name}">
					<button type="button" class="cart-line__step" data-qty-decrease="${product.id}" aria-label="Decrease quantity">&minus;</button>
					<span class="cart-line__qty-value" aria-live="polite">${line.qty}</span>
					<button type="button" class="cart-line__step" data-qty-increase="${product.id}" aria-label="Increase quantity">&plus;</button>
				</div>
			</div>
			<button type="button" class="cart-line__remove" data-remove="${product.id}" aria-label="Remove ${product.name} from cart">Remove</button>
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

		const addTrigger = target.closest<HTMLElement>('[data-add-to-cart]');
		if (addTrigger && !(addTrigger as HTMLButtonElement).disabled) {
			addToCart(addTrigger.dataset.addToCart as string);
			addTrigger.classList.add('is-added');
			const label = addTrigger.querySelector('[data-add-label]');
			const originalLabel = label?.textContent;
			if (label) label.textContent = 'Added';
			window.setTimeout(() => {
				addTrigger.classList.remove('is-added');
				if (label && originalLabel) label.textContent = originalLabel;
			}, 1400);
			return;
		}

		const increase = target.closest<HTMLElement>('[data-qty-increase]');
		if (increase) {
			const id = increase.dataset.qtyIncrease as string;
			const cart = readCart();
			const line = cart.find((l) => l.id === id);
			setQty(id, (line?.qty ?? 0) + 1);
			return;
		}

		const decrease = target.closest<HTMLElement>('[data-qty-decrease]');
		if (decrease) {
			const id = decrease.dataset.qtyDecrease as string;
			const cart = readCart();
			const line = cart.find((l) => l.id === id);
			setQty(id, (line?.qty ?? 1) - 1);
			return;
		}

		const remove = target.closest<HTMLElement>('[data-remove]');
		if (remove) {
			setQty(remove.dataset.remove as string, 0);
			return;
		}
	});

	window.addEventListener('cart:change', render as EventListener);

	// Cart is stored per-tab context but shared across pages via localStorage;
	// keep tabs in sync if the cart changes elsewhere.
	window.addEventListener('storage', (event) => {
		if (event.key === STORAGE_KEY) render();
	});
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
