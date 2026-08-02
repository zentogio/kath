// Valid 2-digit Thai postcode prefixes (one per province/region), derived
// from the Thailand Post postcode allocation table.
const VALID_PREFIXES = new Set([
	'10', '11', '12', '13', '14', '15', '16', '17', '18',
	'20', '21', '22', '23', '24', '25', '26', '27',
	'30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
	'40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
	'50', '51', '52', '53', '54', '55', '56', '57', '58',
	'60', '61', '62', '63', '64', '65', '66', '67',
	'70', '71', '72', '73', '74', '75', '76', '77',
	'80', '81', '82', '83', '84', '85', '86',
	'90', '91', '92', '93', '94', '95', '96',
]);

export function isValidThaiPostcode(pc: string): boolean {
	const trimmed = pc.trim();
	if (!/^\d{5}$/.test(trimmed)) return false;
	return VALID_PREFIXES.has(trimmed.slice(0, 2));
}
