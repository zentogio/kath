import { readLastOrder, formatPrice } from '../data/order';
import { getLang, onLangChange } from '../i18n/state';
import { t } from '../i18n/dict';

// Splits a "{token}" template into text + element nodes and appends them in
// order — avoids building HTML strings out of user-entered data (the
// customer's own name), which innerHTML interpolation would otherwise risk.
function renderTemplateInto(el: HTMLElement, template: string, replacements: Record<string, Node>) {
	el.textContent = '';
	const parts = template.split(/(\{[a-zA-Z]+\})/g);
	for (const part of parts) {
		const match = part.match(/^\{([a-zA-Z]+)\}$/);
		if (match && replacements[match[1]]) {
			el.appendChild(replacements[match[1]]);
		} else if (part) {
			el.appendChild(document.createTextNode(part));
		}
	}
}

function init() {
	const order = readLastOrder();
	const content = document.querySelector<HTMLElement>('[data-complete-content]');
	const emptyState = document.querySelector<HTMLElement>('[data-checkout-empty]');

	if (!order) {
		if (emptyState) emptyState.hidden = false;
		return;
	}

	if (content) content.hidden = false;

	const lang = getLang();
	const titleEl = document.querySelector<HTMLElement>('[data-complete-title]');
	const leadEl = document.querySelector<HTMLElement>('[data-complete-lead]');

	if (titleEl) {
		const nameSpan = document.createElement('span');
		nameSpan.textContent = order.contact.name;
		renderTemplateInto(titleEl, t('complete.titleTemplate', lang), { name: nameSpan });
	}

	if (leadEl) {
		const orderIdEl = document.createElement('strong');
		orderIdEl.textContent = order.orderId;
		const totalEl = document.createElement('strong');
		totalEl.textContent = formatPrice(order.total);
		renderTemplateInto(leadEl, t('complete.leadTemplate', lang), {
			orderId: orderIdEl,
			total: totalEl,
		});
	}
}

init();
onLangChange(init);
