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

// Real product photography from Studio Kath's own shoots (see `product/` at
// the repo root for the originals). `image` and `gallery` hold filename
// slugs resolved to /products/<slug>.webp by productImage() below — the
// files were pre-optimized to webp and served from public/ directly, not
// run through the Astro image pipeline a second time.
export const products: Product[] = [
	{
		id: 'trousers-sand',
		name: 'Pleated Wide-Leg Trousers, Sand',
		price: 1290,
		image: 'trousers-sand',
		gallery: [],
		alt: 'A model in sand-colored pleated wide-leg trousers with a black graphic crop top',
		blurb: 'High-waisted, deep pleats, a wide drop through the leg.',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg. Pairs easily with a cropped top or tucked shirt.',
		soldOut: false,
	},
	{
		id: 'trousers-papaya',
		name: 'Pleated Wide-Leg Trousers, Papaya',
		price: 1290,
		image: 'trousers-papaya',
		gallery: [],
		alt: 'A model in bright papaya orange pleated wide-leg trousers with a white crop top',
		blurb: 'Same cut as our Sand trousers, in a warm papaya orange.',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg. A brighter colorway for the same silhouette.',
		soldOut: false,
	},
	{
		id: 'trousers-indigo-gingham',
		name: 'Gingham Wide-Leg Trousers, Indigo',
		price: 1390,
		image: 'trousers-indigo-gingham',
		gallery: [],
		alt: 'A model in indigo gingham check wide-leg trousers with a white tank top',
		blurb: 'Indigo-and-cream check, cut wide and easy.',
		details: 'A small indigo gingham check, cut in the same wide-leg silhouette with side pockets.',
		soldOut: false,
	},
	{
		id: 'crop-top-yellow-gingham',
		name: 'Tie-Back Crop Top, Yellow Gingham',
		price: 690,
		image: 'crop-top-yellow-gingham',
		gallery: [],
		alt: 'A model in a yellow gingham tie-back crop top with white wide-leg trousers',
		blurb: 'A cropped, tie-back top in a soft yellow check.',
		details: 'Sleeveless, tied at the back, cropped at the waist. Shown here with our Ivory trousers.',
		soldOut: false,
	},
	{
		id: 'trousers-mint',
		name: 'Pleated Wide-Leg Trousers, Mint',
		price: 1290,
		image: 'trousers-mint',
		gallery: [],
		alt: 'A model in mint green pleated wide-leg trousers with a mustard sleeveless top',
		blurb: 'The wide-leg trouser in a cool mint.',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg, in a cool pastel mint.',
		soldOut: false,
	},
	{
		id: 'collar-set-sky',
		name: 'Collared Puff-Sleeve Set, Sky Blue',
		price: 2290,
		image: 'collar-set-sky',
		gallery: [],
		alt: 'A model in a sky blue oversized-collar puff-sleeve blouse with matching shorts',
		blurb: 'An oversized collar, puffed sleeves, matched to pleated shorts.',
		details:
			'A satin blouse with an oversized collar and balloon sleeves, sold as a set with matching pleated shorts.',
		soldOut: false,
	},
	{
		id: 'crop-top-lime',
		name: 'Cropped Satin Top, Lime',
		price: 650,
		image: 'crop-top-lime',
		gallery: [],
		alt: 'A model in a lime green cropped satin top with green wide-leg trousers',
		blurb: 'A relaxed, cropped satin top with a dropped shoulder.',
		details: 'Boxy and cropped with a dropped shoulder, in a bright lime satin.',
		soldOut: false,
	},
	{
		id: 'halter-top-ivory',
		name: 'Halter Top, Ivory Linen',
		price: 650,
		image: 'halter-top-ivory',
		gallery: [],
		alt: 'A model in an ivory linen halter top with mint pleated shorts',
		blurb: 'A high-neck halter in a soft ivory linen.',
		details: 'A high, close neckline with an open back, cut in a soft linen blend. Shown with our Mint shorts.',
		soldOut: false,
	},
	{
		id: 'trousers-floral-meadow',
		name: 'Floral Pleated Trousers, Meadow',
		price: 1490,
		image: 'trousers-floral-meadow',
		gallery: ['trousers-floral-meadow-2'],
		alt: 'A model in meadow floral print pleated wide-leg trousers with a yellow top',
		blurb: 'A wildflower print across the same wide-leg cut.',
		details: 'The wide-leg trouser silhouette in an all-over meadow floral print, on a natural linen ground.',
		soldOut: false,
	},
	{
		id: 'blouse-green-mandarin',
		name: 'Mandarin-Collar Blouse, Green',
		price: 890,
		image: 'blouse-green-mandarin',
		gallery: [],
		alt: 'A model in a bright green mandarin-collar blouse with a white mini skirt',
		blurb: 'A satin blouse with a mandarin collar and full sleeve.',
		details: 'A stand mandarin collar with a keyhole button closure and a full, gathered sleeve.',
		soldOut: false,
	},
	{
		id: 'blouse-papaya-puff',
		name: 'Puff-Sleeve Blouse, Papaya',
		price: 950,
		image: 'blouse-papaya-puff',
		gallery: [],
		alt: 'A model in a papaya-colored puff-sleeve blouse with lavender shorts',
		blurb: 'A dramatic puffed sleeve, worn open over a tank.',
		details: 'An oversized collar and dramatically puffed sleeve, in a warm papaya satin.',
		soldOut: false,
	},
	{
		id: 'satin-set-powder-blue',
		name: 'Satin Shirt Set, Powder Blue',
		price: 1890,
		image: 'satin-set-powder-blue',
		gallery: [],
		alt: 'A model in a powder blue satin shirt and trouser set, loungewear style',
		blurb: 'A matching shirt and trouser set in soft satin.',
		details: 'A relaxed, notch-collar shirt and elastic-waist trouser, cut from the same soft satin.',
		soldOut: false,
	},
	{
		id: 'trousers-taupe-plaid',
		name: 'Plaid Wide-Leg Trousers, Taupe',
		price: 1390,
		image: 'trousers-taupe-plaid',
		gallery: [],
		alt: 'A model in taupe plaid wide-leg trousers with a white corset top',
		blurb: 'A muted taupe plaid, cut wide with a tab-button waist.',
		details: 'A muted taupe-and-cream plaid, high-waisted with a tab-button closure and wide drop.',
		soldOut: false,
	},
	{
		id: 'blouse-lavender-puff',
		name: 'Puff-Sleeve Blouse, Lavender',
		price: 890,
		image: 'blouse-lavender-puff',
		gallery: [],
		alt: 'A model in a lavender puff-sleeve blouse with pale blue trousers',
		blurb: 'A V-neck blouse with a jeweled button placket.',
		details: 'A soft V-neck with a puffed sleeve and jeweled button placket, in a pale lavender.',
		soldOut: false,
	},
	{
		id: 'vest-set-dusty-blue',
		name: 'Linen Vest Set, Dusty Blue',
		price: 1990,
		image: 'vest-set-dusty-blue',
		gallery: ['vest-set-dusty-blue-2'],
		alt: 'A model in a dusty blue linen vest over a paisley blouse with matching trousers',
		blurb: 'A tie-front linen vest, worn over a paisley blouse.',
		details: 'A tie-front linen vest and matching wide-leg trouser, meant to be layered over the paisley blouse.',
		soldOut: false,
	},
	{
		id: 'trousers-sage',
		name: 'Pleated Wide-Leg Trousers, Sage',
		price: 1290,
		image: 'trousers-sage',
		gallery: [],
		alt: 'A model in pale sage pleated wide-leg trousers with a mustard sleeveless top',
		blurb: 'The wide-leg trouser in a pale, dusty sage.',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg, in a pale dusty sage.',
		soldOut: false,
	},
	{
		id: 'trousers-azure',
		name: 'Pleated Wide-Leg Trousers, Azure',
		price: 1290,
		image: 'trousers-azure',
		gallery: [],
		alt: 'A model in azure blue pleated wide-leg trousers with a white crop top',
		blurb: 'The wide-leg trouser in a saturated azure blue.',
		details:
			'High-waisted with double front pleats and a wide, straight drop through the leg, in a saturated azure.',
		soldOut: false,
	},
	{
		id: 'collar-set-peach',
		name: 'Collared Shirt Set, Peach',
		price: 2190,
		image: 'collar-set-peach',
		gallery: [],
		alt: 'A model in a peach oversized-collar shirt with matching pleated shorts',
		blurb: 'An oversized-collar shirt matched to pleated shorts.',
		details: 'A relaxed shirt with an oversized collar and balloon sleeve, sold as a set with matching shorts.',
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
