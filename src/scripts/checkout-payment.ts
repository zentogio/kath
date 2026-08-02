import QRCode from 'qrcode';
import { readCurrentOrder, completeOrder, formatPrice } from '../data/order';
import { buildPromptPayPayload } from './promptpay';

// TODO: replace with the studio's real PromptPay-registered phone number
// (or 13-digit national/tax ID) before taking real payments. This
// placeholder generates a QR that scans, but doesn't route to any real
// account.
const PROMPTPAY_ID = '0000000000';

function initPaymentTabs() {
	const tabs = document.querySelectorAll<HTMLElement>('[data-payment-tab]');
	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			const target = tab.dataset.paymentTab;
			tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
			document.querySelectorAll<HTMLElement>('[data-payment-panel]').forEach((panel) => {
				panel.hidden = panel.dataset.paymentPanel !== target;
			});
		});
	});
}

async function renderQr(amount: number) {
	const container = document.querySelector<HTMLElement>('[data-payment-qr]');
	if (!container) return;
	const payload = buildPromptPayPayload(PROMPTPAY_ID, amount);
	const dataUrl = await QRCode.toDataURL(payload, { width: 240, margin: 1 });
	container.innerHTML = `<img src="${dataUrl}" alt="PromptPay QR code" width="240" height="240" />`;
}

function init() {
	const order = readCurrentOrder();
	const grid = document.querySelector<HTMLElement>('[data-payment-grid]');
	const emptyState = document.querySelector<HTMLElement>('[data-checkout-empty]');

	if (!order) {
		if (emptyState) emptyState.hidden = false;
		return;
	}

	if (grid) grid.hidden = false;

	const orderIdEl = document.querySelector('[data-payment-order-id]');
	const totalEl = document.querySelector('[data-payment-total]');
	if (orderIdEl) orderIdEl.textContent = order.orderId;
	if (totalEl) totalEl.textContent = formatPrice(order.total);

	renderQr(order.total);
	initPaymentTabs();

	document.querySelector('[data-payment-confirm]')?.addEventListener('click', () => {
		completeOrder(order);
		window.location.href = '/checkout/complete/';
	});
}

init();
