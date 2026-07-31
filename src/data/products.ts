export interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
	gallery: string[];
	alt: string;
	blurb: string;
	details: string;
	soldOut: boolean;
}

// Placeholder product photography: real, verified Unsplash editorial shots
// standing in for Studio Kath's own product shoot until one exists. `image`
// is the cover shot used on cards; `gallery` holds additional views of the
// same piece for the quick-view carousel. Rendered in full color (see
// DESIGN.md's "Frame, Not the Cloth" rule) — only the UI chrome is achromatic.
export const products: Product[] = [
	{
		id: 'signature-turtleneck',
		name: 'The Signature Turtleneck',
		price: 3200,
		image: '1758922584983-82ffd5720c6a',
		gallery: ['1613915617430-8ab0fd7c6baf', '1637536701369-f815af927b59'],
		alt: 'A model in a fine-knit black turtleneck against a minimal studio backdrop',
		blurb: 'Fine-gauge wool, hand-finished collar. Cut once a season, in limited numbers.',
		details:
			'Fine-gauge merino, fully fashioned so there are no side seams to chafe. The collar and cuffs are hand-linked, not machine-turned. Cold hand wash or dry clean; lay flat to dry.',
		soldOut: false,
	},
	{
		id: 'ribbed-wool-turtleneck',
		name: 'Ribbed Wool Turtleneck',
		price: 2950,
		image: '1677596346684-8b303f0cb75e',
		gallery: ['1637536701374-073adb2ee745', '1763750783631-10ae2fcdd44f'],
		alt: 'A model wearing a densely ribbed black wool turtleneck',
		blurb: 'Densely ribbed, cut close to the body.',
		details:
			'A tighter rib than our Signature, knit to hold its shape wear after wear. Cut close through the body with room in the shoulder. Dry clean recommended.',
		soldOut: false,
	},
	{
		id: 'column-turtleneck',
		name: 'Column Turtleneck, Long Sleeve',
		price: 3050,
		image: '1591973743676-b274f3a53139',
		gallery: ['1654777673904-d2bbdb3447a1', '1654777673923-ddc2a9c315ad'],
		alt: 'A model in a long-sleeve black turtleneck with an elongated silhouette',
		blurb: 'An elongated silhouette, cut from a single piece of cloth.',
		details:
			'Cut long and lean from a single continuous piece, with no waist seam to interrupt the line. Sits close through the arm, drops straight through the body. Cold hand wash.',
		soldOut: false,
	},
	{
		id: 'heavy-turtleneck',
		name: "Men's Heavy Turtleneck",
		price: 3400,
		image: '1677512447129-3f42081bf9b1',
		gallery: ['1774897795463-e6e4618a4997', '1779466801936-e400e314aca1'],
		alt: 'A model wearing a heavy-gauge black turtleneck sweater',
		blurb: 'A heavier gauge, built for cold rooms and long days.',
		details:
			'Our heaviest gauge — a dense double-knit that holds heat without adding bulk at the seams. Ribbed hem and cuffs are reinforced for years of wear. Dry clean only.',
		soldOut: true,
	},
	{
		id: 'cropped-rib-turtleneck',
		name: 'Cropped Rib Turtleneck',
		price: 2700,
		image: '1677512447079-4415d930df6f',
		gallery: ['1737541929625-6cdbdd280033', '1603462755043-8532712d7693'],
		alt: 'A model in a cropped, high-rib black turtleneck',
		blurb: 'A shorter cut, high rib, worn close.',
		details:
			'A cropped body length with a higher rib count than our standard turtlenecks, so it holds close without needing to be tucked. Best worn with a high-waisted piece. Cold hand wash.',
		soldOut: false,
	},
	{
		id: 'tailored-blazer',
		name: 'The Tailored Blazer',
		price: 6800,
		image: '1603189343302-e603f7add05a',
		gallery: ['1677596346653-b74e22154c33', '1613915617430-8ab0fd7c6baf'],
		alt: 'A model in a structured black tailored blazer',
		blurb: 'Structured shoulder, hand-set lapel, fully canvassed.',
		details:
			'Fully canvassed, not fused — the lapel is hand-set and will hold its roll for the life of the jacket. A structured shoulder without excess padding. Dry clean only.',
		soldOut: false,
	},
	{
		id: 'structured-suit',
		name: 'Structured Two-Piece Suit',
		price: 8900,
		image: '1637536701306-3214e9cec64a',
		gallery: ['1637536701369-f815af927b59', '1637536701374-073adb2ee745'],
		alt: 'A model in a structured black two-piece suit',
		blurb: 'Cut from a single length of cloth, seamed by hand.',
		details:
			'Jacket and trouser cut from the same bolt, seamed by hand at every stress point. A structured, defined shoulder with a nipped waist. Dry clean only.',
		soldOut: false,
	},
	{
		id: 'long-wool-coat',
		name: 'The Long Wool Coat',
		price: 7600,
		image: '1592833578500-1082e18665a3',
		gallery: ['1763750783631-10ae2fcdd44f', '1654777673904-d2bbdb3447a1'],
		alt: 'A model in a long, single-breasted black wool coat',
		blurb: 'A single-breasted coat, weighted for winter.',
		details:
			'A heavy wool coat, single-breasted, cut long enough to layer over anything in the collection. Horn buttons, hand-finished buttonholes. Dry clean only.',
		soldOut: true,
	},
	{
		id: 'essential-shirt',
		name: 'The Essential Shirt',
		price: 2400,
		image: '1634510979979-4be6881d31bb',
		gallery: ['1654777673923-ddc2a9c315ad', '1774897795463-e6e4618a4997'],
		alt: 'A model wearing a plain black shirt',
		blurb: 'A quiet shirt, cut for every day.',
		details:
			'No logo, no print — just a well-cut shirt in a fabric heavy enough not to feel disposable. A single chest pocket, mother-of-pearl buttons. Machine wash cold.',
		soldOut: false,
	},
	{
		id: 'relaxed-overshirt',
		name: 'Relaxed Overshirt',
		price: 2600,
		image: '1612487495933-e94fbb1145e3',
		gallery: ['1779466801936-e400e314aca1', '1737541929625-6cdbdd280033'],
		alt: 'A model in a relaxed black overshirt with a dropped shoulder',
		blurb: 'Room to move, a slightly dropped shoulder.',
		details:
			'Cut with a dropped shoulder and extra room through the body, meant to be worn open over the Essential Shirt or on its own. Garment-washed for a softer hand. Machine wash cold.',
		soldOut: false,
	},
	{
		id: 'boxy-shirt',
		name: 'Boxy Shirt, Long Sleeve',
		price: 2500,
		image: '1610637760728-35230f0547fe',
		gallery: ['1603462755043-8532712d7693', '1677596346653-b74e22154c33'],
		alt: 'A model in a boxy, long-sleeve black shirt',
		blurb: 'A cropped, boxy cut with a dropped hem.',
		details:
			'A shorter, boxier body than our Essential Shirt, with a dropped hem that stays untucked by design. Cut from a slightly heavier cloth. Machine wash cold.',
		soldOut: false,
	},
	{
		id: 'column-dress',
		name: 'The Column Dress',
		price: 4200,
		image: '1664076458686-3449062080ac',
		gallery: ['1613915617430-8ab0fd7c6baf', '1637536701369-f815af927b59'],
		alt: 'A model in a floor-length black column dress',
		blurb: 'One seam, floor-length, cut on the bias.',
		details:
			'Cut on the bias from a single seam running the length of the body, so it moves rather than hangs. Floor-length, weighted hem. Dry clean only.',
		soldOut: false,
	},
];

export const homeSelection = [
	'signature-turtleneck',
	'tailored-blazer',
	'structured-suit',
	'column-dress',
	'essential-shirt',
	'column-turtleneck',
];

export function unsplashUrl(id: string, width = 1200, quality = 80): string {
	return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function formatPrice(price: number): string {
	return `฿${price.toLocaleString('en-US')}`;
}
