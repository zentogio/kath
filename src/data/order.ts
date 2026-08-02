import { products, formatPrice } from './products';

export interface CartLine {
	id: string;
	qty: number;
}

export interface OrderItem {
	id: string;
	name: string;
	price: number;
	qty: number;
	image: string;
}

export interface ContactInfo {
	name: string;
	address: string;
	phone: string;
}

export interface Order {
	orderId: string;
	items: OrderItem[];
	subtotal: number;
	vat: number;
	total: number;
	contact: ContactInfo;
	createdAt: string;
	status: 'pending' | 'awaiting-verification';
}

const CART_KEY = 'studio-kath-cart';
const CONTACT_KEY = 'studio-kath-checkout-info';
const CURRENT_ORDER_KEY = 'studio-kath-current-order';
const LAST_ORDER_KEY = 'studio-kath-last-order';
const ORDERS_KEY = 'studio-kath-orders';

// Displayed product prices are VAT-inclusive (standard for Thai retail) —
// this breaks the already-included 7% out for the receipt line, it does
// not add to the total the customer already sees in their cart.
const VAT_RATE = 0.07;

export function readCart(): CartLine[] {
	try {
		const raw = localStorage.getItem(CART_KEY);
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

export function cartToOrderItems(cart: CartLine[]): OrderItem[] {
	return cart
		.map((line) => {
			const product = products.find((p) => p.id === line.id);
			if (!product) return null;
			return {
				id: product.id,
				name: product.name,
				price: product.price,
				qty: line.qty,
				image: product.image,
			};
		})
		.filter((item): item is OrderItem => item !== null);
}

export function calculateTotals(items: OrderItem[]) {
	const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
	const subtotal = total / (1 + VAT_RATE);
	const vat = total - subtotal;
	return { subtotal, vat, total };
}

export function readContactInfo(): ContactInfo | null {
	try {
		const raw = localStorage.getItem(CONTACT_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed?.name !== 'string') return null;
		return parsed;
	} catch {
		return null;
	}
}

export function saveContactInfo(info: ContactInfo) {
	localStorage.setItem(CONTACT_KEY, JSON.stringify(info));
}

function generateOrderId(): string {
	return `SK-${Date.now().toString(36).toUpperCase()}`;
}

export function createOrder(items: OrderItem[], contact: ContactInfo): Order {
	const { subtotal, vat, total } = calculateTotals(items);
	const order: Order = {
		orderId: generateOrderId(),
		items,
		subtotal,
		vat,
		total,
		contact,
		createdAt: new Date().toISOString(),
		status: 'pending',
	};
	localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(order));
	return order;
}

export function readCurrentOrder(): Order | null {
	try {
		const raw = localStorage.getItem(CURRENT_ORDER_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function readLastOrder(): Order | null {
	try {
		const raw = localStorage.getItem(LAST_ORDER_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

// Marks the order as submitted (not verified — there's no payment gateway
// wired up yet to confirm money actually arrived, see checkout-payment.ts),
// files it into local order history, clears the cart, and hands off to the
// thank-you page via LAST_ORDER_KEY.
export function completeOrder(order: Order) {
	const finished: Order = { ...order, status: 'awaiting-verification' };

	try {
		const raw = localStorage.getItem(ORDERS_KEY);
		const list = raw ? JSON.parse(raw) : [];
		const orders = Array.isArray(list) ? list : [];
		orders.push(finished);
		localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
	} catch {
		// non-critical — this history is a local nicety until a real backend exists
	}

	localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(finished));
	localStorage.removeItem(CURRENT_ORDER_KEY);
	localStorage.removeItem(CART_KEY);
	window.dispatchEvent(new CustomEvent('cart:change', { detail: { cart: [] } }));
}

export { formatPrice };
