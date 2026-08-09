// One-off script: recompress product photos and generate smaller width
// variants for responsive srcset. Run manually with `node scripts/optimize-product-images.mjs`
// — not part of the build. Writes results to src/data/product-image-widths.json.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'products');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp') && !f.includes('-480w') && !f.includes('-800w'));

const RESPONSIVE_WIDTHS = [480, 800];
const QUALITY = 82;

const manifest = {};

for (const file of files) {
	const slug = file.replace(/\.webp$/, '');
	const fullPath = path.join(dir, file);
	const before = fs.statSync(fullPath).size;
	// Read fully into a buffer up front — sharp(path) keeps the source file
	// handle open on this filesystem, which blocks overwriting it later.
	const original = fs.readFileSync(fullPath);
	const meta = await sharp(original).metadata();

	// Recompress the original — several images were under-compressed (same
	// dimensions, needlessly high byte weight).
	const recompressed = await sharp(original).webp({ quality: QUALITY, effort: 6 }).toBuffer();
	fs.writeFileSync(fullPath, recompressed);
	const after = recompressed.length;

	const variants = [{ width: meta.width, file }];

	for (const width of RESPONSIVE_WIDTHS) {
		if (meta.width <= width + 100) continue; // skip near-duplicate / upscale
		const variantFile = `${slug}-${width}w.webp`;
		const variantPath = path.join(dir, variantFile);
		const buf = await sharp(original)
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: QUALITY, effort: 6 })
			.toBuffer();
		fs.writeFileSync(variantPath, buf);
		variants.push({ width, file: variantFile });
	}

	variants.sort((a, b) => a.width - b.width);
	manifest[slug] = variants;

	console.log(
		`${file}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB` +
			(variants.length > 1 ? `, +${variants.length - 1} variant(s)` : ''),
	);
}

const outPath = path.join(process.cwd(), 'src', 'data', 'product-image-widths.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`\nManifest written to ${outPath}`);
