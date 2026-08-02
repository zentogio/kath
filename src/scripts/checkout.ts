import {
	readCart,
	cartToOrderItems,
	calculateTotals,
	readContactInfo,
	saveContactInfo,
	createOrder,
	formatPrice,
	type ContactInfo,
	type OrderItem,
} from '../data/order';
import { products, productImage, productName } from '../data/products';
import { isValidThaiPostcode } from '../data/thai-postcode';
import { getLang, onLangChange } from '../i18n/state';
import { t } from '../i18n/dict';

const ADDRESS_FIELDS = [
	'houseNo',
	'village',
	'soi',
	'road',
	'subdistrict',
	'district',
	'province',
	'postalCode',
] as const;

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
		const lang = getLang();
		const sizeLabel = t('cart.size', lang);
		const qtyLabel = t('common.qty', lang);
		list.innerHTML = items
			.map((item) => {
				const product = products.find((p) => p.id === item.id);
				const name = product ? productName(product, lang) : item.name;
				return `
				<li class="checkout-item">
					<img src="${productImage(item.image)}" alt="" width="72" height="90" loading="lazy" />
					<div class="checkout-item__body">
						<p class="checkout-item__name">${name}</p>
						<p class="checkout-item__meta">${sizeLabel} ${item.size} &middot; ${qtyLabel} ${item.qty}</p>
					</div>
					<p class="checkout-item__price">${formatPrice(item.price * item.qty)}</p>
				</li>`;
			})
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
	const phoneField = form.elements.namedItem('phone') as HTMLInputElement | null;
	if (nameField) nameField.value = info.name;
	if (phoneField) phoneField.value = info.phone;

	for (const key of ADDRESS_FIELDS) {
		const field = form.elements.namedItem(key) as HTMLInputElement | null;
		if (field) field.value = info[key] ?? '';
	}
}

// Strips everything but digits, caps at 10 (Thai mobile numbers), and
// inserts dashes as 095-245-2424.
function formatPhone(raw: string): string {
	const digits = raw.replace(/\D/g, '').slice(0, 10);
	const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
	return parts.join('-');
}

function initPhoneMask() {
	const input = document.querySelector<HTMLInputElement>('[data-phone-input]');
	if (!input) return;
	input.addEventListener('input', () => {
		input.value = formatPhone(input.value);
	});
}

// Postcode is optional, but if the customer entered one it must be a real
// Thai postcode (5 digits, valid province prefix) — see src/data/thai-postcode.ts.
function initPostcodeValidation() {
	const input = document.querySelector<HTMLInputElement>('[data-postcode-input]');
	const error = document.querySelector<HTMLElement>('[data-postcode-error]');
	if (!input || !error) return;
	input.addEventListener('input', () => {
		input.value = input.value.replace(/\D/g, '').slice(0, 5);
		error.hidden = true;
		input.setCustomValidity('');
	});
}

function validatePostcodeField(): boolean {
	const input = document.querySelector<HTMLInputElement>('[data-postcode-input]');
	const error = document.querySelector<HTMLElement>('[data-postcode-error]');
	if (!input || !error) return true;
	const value = input.value.trim();
	if (value === '' || isValidThaiPostcode(value)) {
		error.hidden = true;
		input.setCustomValidity('');
		return true;
	}
	error.hidden = false;
	input.setCustomValidity(t('checkout.postcodeError', getLang()));
	return false;
}

function readContactFromForm(form: HTMLFormElement): ContactInfo {
	const data = new FormData(form);
	const contact = {
		name: String(data.get('name') ?? '').trim(),
		phone: String(data.get('phone') ?? '').trim(),
	} as ContactInfo;
	for (const key of ADDRESS_FIELDS) {
		contact[key] = String(data.get(key) ?? '').trim();
	}
	return contact;
}

function initConfirmDialog(getPending: () => { items: OrderItem[]; contact: ContactInfo } | null) {
	const dialog = document.querySelector<HTMLDialogElement>('[data-confirm-dialog]');
	if (!dialog) return;

	dialog.querySelectorAll('[data-confirm-close]').forEach((btn) => {
		btn.addEventListener('click', () => dialog.close());
	});

	dialog.addEventListener('click', (event) => {
		const panel = dialog.querySelector('.confirm-dialog__panel');
		if (panel && !panel.contains(event.target as Node)) dialog.close();
	});

	dialog.querySelector('[data-confirm-proceed]')?.addEventListener('click', () => {
		const pending = getPending();
		if (!pending) return;
		saveContactInfo(pending.contact);
		createOrder(pending.items, pending.contact);
		window.location.href = '/checkout/payment/';
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

function initForm(items: OrderItem[]) {
	const form = document.querySelector<HTMLFormElement>('[data-checkout-form]');
	const dialog = document.querySelector<HTMLDialogElement>('[data-confirm-dialog]');
	if (!form) return;

	let pending: { items: OrderItem[]; contact: ContactInfo } | null = null;
	initConfirmDialog(() => pending);

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (items.length === 0) return;
		const postcodeOk = validatePostcodeField();
		if (!form.reportValidity() || !postcodeOk) return;

		pending = { items, contact: readContactFromForm(form) };
		dialog?.showModal();
	});
}

const items = renderSummary();
prefillForm();
initPhoneMask();
initPostcodeValidation();
initForm(items);
onLangChange(() => renderSummary());
