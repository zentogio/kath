export interface Product {
	id: string;
	name: string;
	nameTh: string;
	price: number;
	image: string;
	gallery: string[];
	alt: string;
	blurb: string;
	blurbTh: string;
	details: string;
	detailsTh: string;
	soldOut: boolean;
}

// Real product photography from Studio Kath's own shoots (see `product/` at
// the repo root for the originals). `image` and `gallery` hold filename
// slugs resolved to /products/<slug>.webp by productImage() below — the
// files were pre-optimized to webp and served from public/ directly, not
// run through the Astro image pipeline a second time.
//
// `alt` stays English-only (image alt text) — not covered by the language
// toggle for now.
export const products: Product[] = [
	{
		id: 'trousers-sand',
		name: 'Pleated Wide-Leg Trousers, Sand',
		nameTh: 'กางเกงขาบานจีบ สีทราย',
		price: 1290,
		image: 'trousers-sand',
		gallery: [],
		alt: 'A model in sand-colored pleated wide-leg trousers with a black graphic crop top',
		blurb: 'High-waisted, deep pleats, a wide drop through the leg.',
		blurbTh: 'เอวสูง จีบลึก ขากว้างทิ้งตัวสวย',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg. Pairs easily with a cropped top or tucked shirt.',
		detailsTh:
			'เอวสูง จีบหน้าคู่ ขากางเกงบานตรงทิ้งตัว ใส่คู่กับเสื้อครอปหรือเสื้อเชิ้ตสอดชายก็ลงตัว',
		soldOut: false,
	},
	{
		id: 'trousers-papaya',
		name: 'Pleated Wide-Leg Trousers, Papaya',
		nameTh: 'กางเกงขาบานจีบ สีมะละกอ',
		price: 1290,
		image: 'trousers-papaya',
		gallery: [],
		alt: 'A model in bright papaya orange pleated wide-leg trousers with a white crop top',
		blurb: 'Same cut as our Sand trousers, in a warm papaya orange.',
		blurbTh: 'แพทเทิร์นเดียวกับตัวสีทราย แต่มาในโทนส้มมะละกอสดใส',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg. A brighter colorway for the same silhouette.',
		detailsTh:
			'เอวสูง จีบหน้าคู่ ขาบานทิ้งตัวตรง ทรงเดิมที่คุ้นเคยแต่เพิ่มความสดใสด้วยสีส้มมะละกอ',
		soldOut: false,
	},
	{
		id: 'trousers-indigo-gingham',
		name: 'Gingham Wide-Leg Trousers, Indigo',
		nameTh: 'กางเกงขาบานลายกิงแฮม สีอินดิโก',
		price: 1390,
		image: 'trousers-indigo-gingham',
		gallery: [],
		alt: 'A model in indigo gingham check wide-leg trousers with a white tank top',
		blurb: 'Indigo-and-cream check, cut wide and easy.',
		blurbTh: 'ลายตารางอินดิโก-ครีม ทรงขาบานใส่สบาย',
		details: 'A small indigo gingham check, cut in the same wide-leg silhouette with side pockets.',
		detailsTh: 'ลายตารางกิงแฮมขนาดเล็กโทนอินดิโก ทรงขาบานเหมือนเดิม มีกระเป๋าข้าง',
		soldOut: false,
	},
	{
		id: 'crop-top-yellow-gingham',
		name: 'Tie-Back Crop Top, Yellow Gingham',
		nameTh: 'เสื้อครอปผูกหลัง ลายกิงแฮมสีเหลือง',
		price: 690,
		image: 'crop-top-yellow-gingham',
		gallery: [],
		alt: 'A model in a yellow gingham tie-back crop top with white wide-leg trousers',
		blurb: 'A cropped, tie-back top in a soft yellow check.',
		blurbTh: 'เสื้อครอปผูกเชือกด้านหลัง ลายตารางเหลืองอ่อนหวาน',
		details: 'Sleeveless, tied at the back, cropped at the waist. Shown here with our Ivory trousers.',
		detailsTh: 'แขนกุด ผูกเชือกด้านหลัง ตัวสั้นเสมอเอว ในภาพจับคู่กับกางเกงสีไอวอรี่',
		soldOut: false,
	},
	{
		id: 'trousers-mint',
		name: 'Pleated Wide-Leg Trousers, Mint',
		nameTh: 'กางเกงขาบานจีบ สีมินต์',
		price: 1290,
		image: 'trousers-mint',
		gallery: [],
		alt: 'A model in mint green pleated wide-leg trousers with a mustard sleeveless top',
		blurb: 'The wide-leg trouser in a cool mint.',
		blurbTh: 'กางเกงขาบานทรงเดิม ในโทนมินต์เย็นตา',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg, in a cool pastel mint.',
		detailsTh: 'เอวสูง จีบหน้าคู่ ขาบานทิ้งตัวตรง สีมินต์พาสเทลให้ความรู้สึกสดชื่น',
		soldOut: false,
	},
	{
		id: 'collar-set-sky',
		name: 'Collared Puff-Sleeve Set, Sky Blue',
		nameTh: 'เซ็ตเสื้อปกโบว์แขนพอง สีฟ้า',
		price: 2290,
		image: 'collar-set-sky',
		gallery: [],
		alt: 'A model in a sky blue oversized-collar puff-sleeve blouse with matching shorts',
		blurb: 'An oversized collar, puffed sleeves, matched to pleated shorts.',
		blurbTh: 'ปกเสื้อใหญ่ แขนพอง จับคู่กับกางเกงขาสั้นจีบ',
		details:
			'A satin blouse with an oversized collar and balloon sleeves, sold as a set with matching pleated shorts.',
		detailsTh: 'เสื้อซาตินปกใหญ่ แขนบอลลูน จำหน่ายเป็นเซ็ตคู่กับกางเกงขาสั้นจีบลายเดียวกัน',
		soldOut: false,
	},
	{
		id: 'crop-top-lime',
		name: 'Cropped Satin Top, Lime',
		nameTh: 'เสื้อครอปซาติน สีเขียวไลม์',
		price: 650,
		image: 'crop-top-lime',
		gallery: [],
		alt: 'A model in a lime green cropped satin top with green wide-leg trousers',
		blurb: 'A relaxed, cropped satin top with a dropped shoulder.',
		blurbTh: 'เสื้อครอปซาติน ทรงหลวมไหล่ตก ใส่สบาย',
		details: 'Boxy and cropped with a dropped shoulder, in a bright lime satin.',
		detailsTh: 'ทรงกล่องสั้น ไหล่ตก ผ้าซาตินเขียวไลม์สดใส',
		soldOut: false,
	},
	{
		id: 'halter-top-ivory',
		name: 'Halter Top, Ivory Linen',
		nameTh: 'เสื้อฮอลเตอร์ ผ้าลินินสีไอวอรี่',
		price: 650,
		image: 'halter-top-ivory',
		gallery: [],
		alt: 'A model in an ivory linen halter top with mint pleated shorts',
		blurb: 'A high-neck halter in a soft ivory linen.',
		blurbTh: 'เสื้อฮอลเตอร์คอสูง ผ้าลินินไอวอรี่เนื้อนุ่ม',
		details: 'A high, close neckline with an open back, cut in a soft linen blend. Shown with our Mint shorts.',
		detailsTh: 'คอสูงกระชับ เปิดหลัง ตัดจากผ้าลินินผสมเนื้อนุ่ม ในภาพจับคู่กับกางเกงขาสั้นสีมินต์',
		soldOut: false,
	},
	{
		id: 'trousers-floral-meadow',
		name: 'Floral Pleated Trousers, Meadow',
		nameTh: 'กางเกงขาบานจีบลายดอกไม้ Meadow',
		price: 1490,
		image: 'trousers-floral-meadow',
		gallery: ['trousers-floral-meadow-2'],
		alt: 'A model in meadow floral print pleated wide-leg trousers with a yellow top',
		blurb: 'A wildflower print across the same wide-leg cut.',
		blurbTh: 'ลายดอกไม้ป่าเต็มตัว บนทรงขาบานคุ้นเคย',
		details: 'The wide-leg trouser silhouette in an all-over meadow floral print, on a natural linen ground.',
		detailsTh: 'ทรงขาบานเดิม พิมพ์ลายดอกไม้เต็มผืนบนพื้นผ้าลินินธรรมชาติ',
		soldOut: false,
	},
	{
		id: 'blouse-green-mandarin',
		name: 'Mandarin-Collar Blouse, Green',
		nameTh: 'เสื้อเบลาส์คอจีน สีเขียว',
		price: 890,
		image: 'blouse-green-mandarin',
		gallery: [],
		alt: 'A model in a bright green mandarin-collar blouse with a white mini skirt',
		blurb: 'A satin blouse with a mandarin collar and full sleeve.',
		blurbTh: 'เสื้อเบลาส์ซาติน คอจีน แขนยาวเต็มตัว',
		details: 'A stand mandarin collar with a keyhole button closure and a full, gathered sleeve.',
		detailsTh: 'คอจีนตั้ง กระดุมหน้าแบบช่องหยดน้ำ แขนยาวจับจีบ',
		soldOut: false,
	},
	{
		id: 'blouse-papaya-puff',
		name: 'Puff-Sleeve Blouse, Papaya',
		nameTh: 'เสื้อเบลาส์แขนพอง สีมะละกอ',
		price: 950,
		image: 'blouse-papaya-puff',
		gallery: [],
		alt: 'A model in a papaya-colored puff-sleeve blouse with lavender shorts',
		blurb: 'A dramatic puffed sleeve, worn open over a tank.',
		blurbTh: 'แขนพองเด่นสะดุดตา ใส่เปิดคลุมทับเสื้อกล้ามได้',
		details: 'An oversized collar and dramatically puffed sleeve, in a warm papaya satin.',
		detailsTh: 'ปกเสื้อใหญ่ แขนพองชัดเจน ผ้าซาตินโทนส้มมะละกอ',
		soldOut: false,
	},
	{
		id: 'satin-set-powder-blue',
		name: 'Satin Shirt Set, Powder Blue',
		nameTh: 'เซ็ตเสื้อเชิ้ตซาติน สีฟ้าพาวเดอร์',
		price: 1890,
		image: 'satin-set-powder-blue',
		gallery: [],
		alt: 'A model in a powder blue satin shirt and trouser set, loungewear style',
		blurb: 'A matching shirt and trouser set in soft satin.',
		blurbTh: 'เซ็ตเสื้อเชิ้ตคู่กางเกง ผ้าซาตินเนื้อนุ่ม',
		details: 'A relaxed, notch-collar shirt and elastic-waist trouser, cut from the same soft satin.',
		detailsTh: 'เสื้อเชิ้ตทรงหลวมปกแหลม คู่กางเกงเอวยางยืด ตัดจากผ้าซาตินผืนเดียวกัน',
		soldOut: false,
	},
	{
		id: 'trousers-taupe-plaid',
		name: 'Plaid Wide-Leg Trousers, Taupe',
		nameTh: 'กางเกงขาบานลายสก็อต สีโท้ป',
		price: 1390,
		image: 'trousers-taupe-plaid',
		gallery: [],
		alt: 'A model in taupe plaid wide-leg trousers with a white corset top',
		blurb: 'A muted taupe plaid, cut wide with a tab-button waist.',
		blurbTh: 'ลายสก็อตโทนโท้ปหม่นๆ ทรงขาบาน เอวกระดุมแท็บ',
		details: 'A muted taupe-and-cream plaid, high-waisted with a tab-button closure and wide drop.',
		detailsTh: 'ลายสก็อตโท้ป-ครีมโทนหม่น เอวสูง ปิดด้วยกระดุมแท็บ ขาบานทิ้งตัว',
		soldOut: false,
	},
	{
		id: 'blouse-lavender-puff',
		name: 'Puff-Sleeve Blouse, Lavender',
		nameTh: 'เสื้อเบลาส์แขนพอง สีลาเวนเดอร์',
		price: 890,
		image: 'blouse-lavender-puff',
		gallery: [],
		alt: 'A model in a lavender puff-sleeve blouse with pale blue trousers',
		blurb: 'A V-neck blouse with a jeweled button placket.',
		blurbTh: 'เสื้อคอวี สาบกระดุมประดับ',
		details: 'A soft V-neck with a puffed sleeve and jeweled button placket, in a pale lavender.',
		detailsTh: 'คอวีนุ่มๆ แขนพอง สาบกระดุมประดับ โทนลาเวนเดอร์อ่อน',
		soldOut: false,
	},
	{
		id: 'vest-set-dusty-blue',
		name: 'Linen Vest Set, Dusty Blue',
		nameTh: 'เซ็ตเสื้อกั๊กลินิน สีฟ้าหม่น',
		price: 1990,
		image: 'vest-set-dusty-blue',
		gallery: ['vest-set-dusty-blue-2'],
		alt: 'A model in a dusty blue linen vest over a paisley blouse with matching trousers',
		blurb: 'A tie-front linen vest, worn over a paisley blouse.',
		blurbTh: 'เสื้อกั๊กลินินผูกหน้า ใส่คลุมทับเสื้อลายเพสลีย์',
		details: 'A tie-front linen vest and matching wide-leg trouser, meant to be layered over the paisley blouse.',
		detailsTh: 'เสื้อกั๊กลินินผูกหน้า คู่กางเกงขาบานชุดเดียวกัน ออกแบบมาให้ใส่ทับเสื้อลายเพสลีย์',
		soldOut: false,
	},
	{
		id: 'trousers-sage',
		name: 'Pleated Wide-Leg Trousers, Sage',
		nameTh: 'กางเกงขาบานจีบ สีเซจ',
		price: 1290,
		image: 'trousers-sage',
		gallery: [],
		alt: 'A model in pale sage pleated wide-leg trousers with a mustard sleeveless top',
		blurb: 'The wide-leg trouser in a pale, dusty sage.',
		blurbTh: 'กางเกงขาบานทรงเดิม โทนเขียวเซจหม่นอ่อน',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg, in a pale dusty sage.',
		detailsTh: 'เอวสูง จีบหน้าคู่ ขาบานทิ้งตัวตรง สีเขียวเซจหม่นละมุนตา',
		soldOut: false,
	},
	{
		id: 'trousers-azure',
		name: 'Pleated Wide-Leg Trousers, Azure',
		nameTh: 'กางเกงขาบานจีบ สีฟ้าอาชัวร์',
		price: 1290,
		image: 'trousers-azure',
		gallery: [],
		alt: 'A model in azure blue pleated wide-leg trousers with a white crop top',
		blurb: 'The wide-leg trouser in a saturated azure blue.',
		blurbTh: 'กางเกงขาบานทรงเดิม โทนฟ้าอาชัวร์เข้มสด',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg, in a saturated azure.',
		detailsTh: 'เอวสูง จีบหน้าคู่ ขาบานทิ้งตัวตรง สีฟ้าอาชัวร์สดจัดจ้าน',
		soldOut: false,
	},
	{
		id: 'collar-set-peach',
		name: 'Collared Shirt Set, Peach',
		nameTh: 'เซ็ตเสื้อเชิ้ตปกใหญ่ สีพีช',
		price: 2190,
		image: 'collar-set-peach',
		gallery: [],
		alt: 'A model in a peach oversized-collar shirt with matching pleated shorts',
		blurb: 'An oversized-collar shirt matched to pleated shorts.',
		blurbTh: 'เสื้อเชิ้ตปกใหญ่ จับคู่กางเกงขาสั้นจีบ',
		details: 'A relaxed shirt with an oversized collar and balloon sleeve, sold as a set with matching shorts.',
		detailsTh: 'เสื้อเชิ้ตทรงหลวม ปกใหญ่ แขนบอลลูน จำหน่ายเป็นเซ็ตคู่กางเกงขาสั้นลายเดียวกัน',
		soldOut: false,
	},
];

export const homeSelection = [
	'trousers-papaya',
	'collar-set-sky',
	'trousers-floral-meadow',
	'vest-set-dusty-blue',
	'blouse-green-mandarin',
	'trousers-indigo-gingham',
];

export function productImage(slug: string): string {
	return `/products/${slug}.webp`;
}

export function formatPrice(price: number): string {
	return `฿${price.toLocaleString('en-US')}`;
}

export function productName(product: Product, lang: 'en' | 'th'): string {
	return lang === 'th' ? product.nameTh : product.name;
}

export function productBlurb(product: Product, lang: 'en' | 'th'): string {
	return lang === 'th' ? product.blurbTh : product.blurb;
}

export function productDetails(product: Product, lang: 'en' | 'th'): string {
	return lang === 'th' ? product.detailsTh : product.details;
}

// One shared size run across the catalog (trousers, tops, and sets alike).
// Measurements are placeholders — TODO: swap for the studio's real
// measurements per size before this goes live.
export const SIZES = ['S', 'M', 'L', 'XL'] as const;
export type Size = (typeof SIZES)[number];

export interface SizeChartRow {
	size: Size;
	waist: string;
	hip: string;
	length: string;
}

export const SIZE_CHART: SizeChartRow[] = [
	{ size: 'S', waist: '26–28"', hip: '36–38"', length: '39"' },
	{ size: 'M', waist: '28–30"', hip: '38–40"', length: '40"' },
	{ size: 'L', waist: '30–32"', hip: '40–42"', length: '41"' },
	{ size: 'XL', waist: '32–34"', hip: '42–44"', length: '42"' },
];
