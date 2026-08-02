const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.join(__dirname, '..', 'product');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'products');

// filename -> output slug. Photos are grouped where the same garment was
// shot twice (two angles / two settings) so they share a gallery.
const groups = [
	{ slug: 'trousers-sand', files: ['751578035_1930666247631124_4099570315023260405_n.jpg'] },
	{ slug: 'trousers-papaya', files: ['751578035_953821884385576_8336606578575223093_n.jpg'] },
	{ slug: 'trousers-indigo-gingham', files: ['752198296_1198154639152208_5009320609909257668_n.jpg'] },
	{ slug: 'crop-top-yellow-gingham', files: ['752631644_1027629000245247_6366476508523139853_n.jpg'] },
	{ slug: 'trousers-mint', files: ['753224875_1313291807271008_6012114062753881112_n.jpg'] },
	{ slug: 'collar-set-sky', files: ['755396596_1234281252129655_8991368894541628859_n.jpg'] },
	{ slug: 'crop-top-lime', files: ['755463380_1750251182642978_3590530380680972345_n.jpg'] },
	{ slug: 'halter-top-ivory', files: ['755689703_1581118156976079_1968053494944063682_n.jpg'] },
	{
		slug: 'trousers-floral-meadow',
		files: [
			'756035025_1037065192393865_6807178722558143074_n.jpg',
			'756132776_1414464873883203_1074884071983338007_n.jpg',
		],
	},
	{ slug: 'blouse-green-mandarin', files: ['756332921_1386386706760838_7839810610938249676_n.jpg'] },
	{ slug: 'blouse-papaya-puff', files: ['756332921_1959280058068069_5858331081121368635_n.jpg'] },
	{ slug: 'satin-set-powder-blue', files: ['757065164_1764192348345156_8945334196707358346_n.jpg'] },
	{ slug: 'trousers-taupe-plaid', files: ['757880386_1222477803389046_8406490937104036819_n.jpg'] },
	{ slug: 'blouse-lavender-puff', files: ['759348529_1616826640154506_4573952436216882973_n.jpg'] },
	{
		slug: 'vest-set-dusty-blue',
		files: [
			'759508381_2560532887735898_8734945845045324078_n.jpg',
			'760441302_1712872176627766_4909663637699726385_n.jpg',
		],
	},
	{ slug: 'trousers-sage', files: ['759931826_1476618754232571_2041425113433427028_n.jpg'] },
	{ slug: 'trousers-azure', files: ['760030407_28024614583840201_523996337581111690_n.jpg'] },
	{ slug: 'collar-set-peach', files: ['760122586_1038615872104281_1652048092391002579_n.jpg'] },
];

async function convertOne(file, outName) {
	const input = path.join(SRC, file);
	const output = path.join(OUT, outName);
	await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
	const { size } = fs.statSync(output);
	console.log('wrote', outName, `${Math.round(size / 1024)}kB`);
}

(async () => {
	for (const group of groups) {
		for (let i = 0; i < group.files.length; i++) {
			const outName = i === 0 ? `${group.slug}.webp` : `${group.slug}-${i + 1}.webp`;
			await convertOne(group.files[i], outName);
		}
	}

	// Brand logo → webp, alpha preserved.
	await sharp(path.join(__dirname, '..', 'Real logo no bg.png'))
		.resize({ width: 900, withoutEnlargement: true })
		.webp({ quality: 90 })
		.toFile(path.join(__dirname, '..', 'src', 'assets', 'brand', 'studio-mark.webp'));
	console.log('wrote studio-mark.webp');
})();
