// Thai PromptPay QR payload (EMVCo Merchant Presented Mode). This is a
// public, documented format — generating a scannable QR needs no gateway
// account, just a PromptPay-registered phone number or national ID. What a
// gateway adds on top is a webhook telling us when it's actually been paid,
// which this site doesn't have yet (see checkout-payment.ts).

function tlv(id: string, value: string): string {
	const length = String(value.length).padStart(2, '0');
	return `${id}${length}${value}`;
}

// CRC-16/CCITT-FALSE, as required by the EMVCo QR spec.
function crc16(payload: string): string {
	let crc = 0xffff;
	for (let i = 0; i < payload.length; i++) {
		crc ^= payload.charCodeAt(i) << 8;
		for (let j = 0; j < 8; j++) {
			crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
		}
	}
	return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatMobile(digits: string): string {
	const local = digits.startsWith('0') ? digits.slice(1) : digits;
	return `0066${local}`;
}

export function buildPromptPayPayload(promptPayId: string, amount: number): string {
	const digits = promptPayId.replace(/\D/g, '');
	const isNationalId = digits.length === 13;
	const target = isNationalId ? digits : formatMobile(digits);
	const targetTag = isNationalId ? '02' : '01';

	const merchantInfo = tlv('00', 'A000000677010111') + tlv(targetTag, target);

	const fields =
		tlv('00', '01') + // payload format indicator
		tlv('01', '12') + // point of initiation: dynamic (amount is fixed)
		tlv('29', merchantInfo) + // PromptPay merchant account info
		tlv('53', '764') + // currency: THB
		tlv('54', amount.toFixed(2)) + // amount
		tlv('58', 'TH') + // country
		tlv('59', 'STUDIO KATH') + // merchant name
		tlv('60', 'BANGKOK'); // merchant city

	const withHeader = `${fields}6304`;
	return `${withHeader}${crc16(withHeader)}`;
}
