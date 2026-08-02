import {
	readCart,
	cartToOrderItems,
	calculateTotals,
	readContactInfo,
	saveContactInfo,
	createOrder,
	formatPrice,
	type OrderItem,
} from '../data/order';
import { productImage } from '../data/products';

function renderSummary(): OrderItem[] {
	const items = cartToOrderItems(readCart());
	const list = document.querySelector<HTMLElement>('[data-checkout-items]');
	const grid = document.querySelector<HTMLElement>('[data-checkout-grid]');
	const emptyState = document.querySelector<HTMLElement>('[data-checkout-empty]');

	if (items.length === 0) {
		if (grid) grid.hidden = true;
		if (emptyState) emptyState.hidden = false;
		return items;
	}

	if (grid) grid.hidden = false;
	if (emptyState) emptyState.hidden = true;

	if (list) {
		list.innerHTML = items
			.map(
				(item) => `
				<li class="checkout-item">
					<img src="${productImage(item.image)}" alt="" width="72" height="90" loading="lazy" />
					<div class="checkout-item__body">
						<p class="checkout-item__name">${item.name}</p>
						<p class="checkout-item__meta">Size ${item.size} &middot; Qty ${item.qty}</p>
					</div>
					<p class="checkout-item__price">${formatPrice(item.price * item.qty)}</p>
				</li>`,
			)
			.join('');
	}

	const { total } = calculateTotals(items);
	const totalEl = document.querySelector('[data-checkout-total]');
	if (totalEl) totalEl.textContent = formatPrice(total);

	return items;
}

function prefillForm() {
	const info = readContactInfo();
	const form = document.querySelector<HTMLFormElement>('[data-checkout-form]');
	if (!info || !form) return;

	const nameField = form.elements.namedItem('name') as HTMLInputElement | null;
	const addressField = form.elements.namedItem('address') as HTMLTextAreaElement | null;
	const phoneField = form.elements.namedItem('phone') as HTMLInputElement | null;
	if (nameField) nameField.value = info.name;
	if (addressField) addressField.value = info.address;
	if (phoneField) phoneField.value = info.phone;
}

function initForm(items: OrderItem[]) {
	const form = document.querySelector<HTMLFormElement>('[data-checkout-form]');
	if (!form) return;

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (items.length === 0) return;

		const data = new FormData(form);
		const contact = {
			name: String(data.get('name') ?? '').trim(),
			address: String(data.get('address') ?? '').trim(),
			phone: String(data.get('phone') ?? '').trim(),
		};
		if (!contact.name || !contact.address || !contact.phone) return;

		saveContactInfo(contact);
		createOrder(items, contact);
		window.location.href = '/checkout/payment/';
	});
}

const items = renderSummary();
prefillForm();
initForm(items);
