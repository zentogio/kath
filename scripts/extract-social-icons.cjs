const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'app logo');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'brand', 'social');

// mode 'white-glyph': keep near-white pixels (the glyph is drawn white on a
// saturated brand-color background) and render them solid black.
// mode 'dark-glyph': keep near-opaque, non-white pixels (the glyph is drawn
// in color on a transparent/white canvas) and render them solid black.
async function extractGlyph(inputPath, outputPath, mode, crop, thresholds) {
	let img = sharp(inputPath).ensureAlpha();
	if (crop) img = img.extract(crop);
	const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
	const { width, height, channels } = info;
	const out = Buffer.alloc(width * height * 4);

	const loLum = thresholds?.lo ?? 150;
	const hiLum = thresholds?.hi ?? 220;

	for (let i = 0; i < width * height; i++) {
		const idx = i * channels;
		const r = data[idx];
		const g = data[idx + 1];
		const b = data[idx + 2];
		const a = channels === 4 ? data[idx + 3] : 255;
		const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

		let t;
		if (mode === 'white-glyph') {
			t = (luminance - loLum) / (hiLum - loLum);
		} else {
			t = (hiLum - luminance) / (hiLum - loLum);
		}
		t = Math.max(0, Math.min(1, t));

		const outIdx = i * 4;
		out[outIdx] = 0;
		out[outIdx + 1] = 0;
		out[outIdx + 2] = 0;
		out[outIdx + 3] = Math.round(a * t);
	}

	await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(outputPath);
	console.log('wrote', outputPath, width, 'x', height);
}

// Lazada's mark is a warm (orange/pink/red) shape on a navy background, with
// a white wordmark cut into it — neither mode above fits (both assume a
// white/light background). Classify by red-minus-blue instead: the navy
// background is blue-dominant (r-b very negative), the warm shape is
// red-dominant (r-b strongly positive), and the white wordmark is neutral
// (r-b ~ 0), so it falls out as a transparent hole exactly like Shopee's
// white "S".
async function extractWarmGlyph(inputPath, outputPath, thresholds) {
	const img = sharp(inputPath).ensureAlpha();
	const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
	const { width, height, channels } = info;
	const out = Buffer.alloc(width * height * 4);

	const lo = thresholds?.lo ?? 0;
	const hi = thresholds?.hi ?? 60;

	for (let i = 0; i < width * height; i++) {
		const idx = i * channels;
		const r = data[idx];
		const b = data[idx + 2];
		const a = channels === 4 ? data[idx + 3] : 255;
		let t = (r - b - lo) / (hi - lo);
		t = Math.max(0, Math.min(1, t));

		const outIdx = i * 4;
		out[outIdx] = 0;
		out[outIdx + 1] = 0;
		out[outIdx + 2] = 0;
		out[outIdx + 3] = Math.round(a * t);
	}

	await sharp(out, { raw: { width, height, channels: 4 } })
		.trim()
		.png()
		.toFile(outputPath);
	console.log('wrote', outputPath);
}

(async () => {
	await extractGlyph(
		path.join(SRC, 'Instagram_logo_2022.svg.webp'),
		path.join(OUT, 'instagram-mark.png'),
		'white-glyph',
		null,
		{ lo: 210, hi: 248 },
	);
	await extractGlyph(
		path.join(SRC, 'Facebook_icon.svg.webp'),
		path.join(OUT, 'facebook-mark.png'),
		'white-glyph',
	);
	await extractGlyph(
		path.join(SRC, 'Shopee_logo.svg.webp'),
		path.join(OUT, 'shopee-mark.png'),
		'dark-glyph',
		{ left: 35, top: 0, width: 890, height: 995 },
	);
	await extractGlyph(
		path.join(SRC, 'LINE_logo.svg.webp'),
		path.join(OUT, 'line-mark.png'),
		'white-glyph',
		null,
		{ lo: 210, hi: 248 },
	);
	await extractWarmGlyph(path.join(SRC, 'lazada.png'), path.join(OUT, 'lazada-mark.png'));
})();
