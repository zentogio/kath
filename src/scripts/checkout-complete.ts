import { readLastOrder, formatPrice } from '../data/order';

function init() {
	const order = readLastOrder();
	const content = document.querySelector<HTMLElement>('[data-complete-content]');
	const emptyState = document.querySelector<HTMLElement>('[data-checkout-empty]');

	if (!order) {
		if (emptyState) emptyState.hidden = false;
		return;
	}

	if (content) content.hidden = false;

	const orderIdEl = document.querySelector('[data-complete-order-id]');
	const totalEl = document.querySelector('[data-complete-total]');
	const nameEl = document.querySelector('[data-complete-name]');
	if (orderIdEl) orderIdEl.textContent = order.orderId;
	if (totalEl) totalEl.textContent = formatPrice(order.total);
	if (nameEl) nameEl.textContent = order.contact.name;
}

init();
