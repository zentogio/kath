export type Lang = 'en' | 'th';

// Shared UI copy for the whole site. Thai entries are written to read
// naturally (not literal word-for-word translations) — see individual
// choices below. Product name/blurb/details live in src/data/products.ts
// instead, since they're per-product data rather than UI chrome.
export const dict: Record<string, Record<Lang, string>> = {
	// ---- Language toggle itself ----
	'lang.en': { en: 'EN', th: 'EN' },
	'lang.th': { en: 'ไทย', th: 'ไทย' },
	'lang.toggle': { en: 'Change language', th: 'เปลี่ยนภาษา' },

	// ---- Nav / footer / mobile menu ----
	'nav.home': { en: 'Home', th: 'หน้าแรก' },
	'nav.collection': { en: 'Collection', th: 'คอลเลกชัน' },
	'nav.about': { en: 'About', th: 'เกี่ยวกับเรา' },
	'nav.contact': { en: 'Contact', th: 'ติดต่อเรา' },
	'nav.openMenu': { en: 'Open menu', th: 'เปิดเมนู' },
	'nav.closeMenu': { en: 'Close menu', th: 'ปิดเมนู' },
	'nav.openCart': { en: 'Open cart', th: 'เปิดตะกร้า' },
	'menu.getInTouch': { en: 'Get in touch', th: 'ติดต่อเรา' },

	'footer.tagline': {
		en: 'Hand-cut, small-batch clothing made to last, not to trend.',
		th: 'เสื้อผ้าตัดด้วยมือ ผลิตทีละน้อย เน้นใส่ทน ไม่เน้นตามเทรนด์',
	},
	'footer.site': { en: 'Site', th: 'เมนู' },
	'footer.getInTouch': { en: 'Get in Touch', th: 'ช่องทางติดต่อ' },
	'footer.studio': { en: 'Studio', th: 'สตูดิโอ' },
	'footer.copyright': {
		en: 'All pieces cut to order.',
		th: 'ทุกชิ้นตัดตามออเดอร์',
	},
	'footer.privacyLink': { en: 'Privacy Notice', th: 'นโยบายความเป็นส่วนตัว' },

	'common.address': {
		en: '39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900',
		th: '39/1 ซอยทองหล่อ 2 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
	},

	// ---- Shared / common ----
	'common.addToCart': { en: 'Add to Cart', th: 'เพิ่มลงตะกร้า' },
	'common.soldOut': { en: 'Sold Out', th: 'สินค้าหมด' },
	'common.total': { en: 'Total', th: 'ยอดรวม' },
	'common.getInTouch': { en: 'Get in Touch', th: 'ติดต่อเรา' },
	'common.browseCollection': { en: 'Browse the Collection', th: 'ดูคอลเลกชันทั้งหมด' },
	'common.close': { en: 'Close', th: 'ปิด' },
	'common.qty': { en: 'Qty', th: 'จำนวน' },

	// ---- Cart drawer ----
	'cart.title': { en: 'Cart', th: 'ตะกร้าสินค้า' },
	'cart.closeAria': { en: 'Close cart', th: 'ปิดตะกร้า' },
	'cart.empty': { en: 'Your cart is empty.', th: 'ยังไม่มีสินค้าในตะกร้า' },
	'cart.checkout': { en: 'Checkout', th: 'ชำระเงิน' },
	'cart.size': { en: 'Size', th: 'ไซส์' },
	'cart.remove': { en: 'Remove', th: 'ลบออก' },

	// ---- Quick view ----
	'quickview.closeAria': { en: 'Close', th: 'ปิด' },
	'quickview.prevAria': { en: 'Previous photo', th: 'รูปก่อนหน้า' },
	'quickview.nextAria': { en: 'Next photo', th: 'รูปถัดไป' },
	'quickview.viewDetails': { en: 'View Details', th: 'ดูรายละเอียด' },
	'quickview.note': {
		en: 'All pieces cut to order, in limited numbers.',
		th: 'ทุกชิ้นตัดตามออเดอร์ จำนวนจำกัด',
	},
	'quickview.noteLink': { en: 'See the full collection', th: 'ดูคอลเลกชันทั้งหมด' },
	'quickview.viewPhoto': { en: 'View photo', th: 'ดูรูปที่' },

	// ---- Size select dialog ----
	'sizeDialog.chartTitle': { en: 'Size Guide (in)', th: 'ตารางไซส์ (นิ้ว)' },
	'sizeDialog.colSize': { en: 'Size', th: 'ไซส์' },
	'sizeDialog.colWaist': { en: 'Waist', th: 'เอว' },
	'sizeDialog.colHip': { en: 'Hip', th: 'สะโพก' },
	'sizeDialog.colLength': { en: 'Length', th: 'ความยาว' },
	'sizeDialog.sizeLabel': { en: 'Size', th: 'เลือกไซส์' },
	'sizeDialog.quantityLabel': { en: 'Quantity', th: 'จำนวน' },
	'sizeDialog.decreaseAria': { en: 'Decrease quantity', th: 'ลดจำนวน' },
	'sizeDialog.increaseAria': { en: 'Increase quantity', th: 'เพิ่มจำนวน' },
	'sizeDialog.selectPrompt': { en: 'Select a Size', th: 'กรุณาเลือกไซส์' },
	'sizeDialog.confirmWithQty': { en: 'Add to Cart — Qty', th: 'เพิ่มลงตะกร้า — จำนวน' },

	// ---- Home ----
	'home.ticker1': { en: 'Hand-Cut', th: 'ตัดด้วยมือ' },
	'home.ticker2': { en: 'Small Batch', th: 'ผลิตทีละน้อย' },
	'home.ticker3': { en: 'Numbered, Not Mass-Produced', th: 'มีเลขกำกับ ไม่ใช่งานล็อตใหญ่' },
	'home.ticker4': { en: 'Made to Last', th: 'ใส่ได้นาน' },
	'home.heroHeadline': { en: 'Cut by hand.<br />Made in small batches.', th: 'ตัดด้วยมือ<br />ผลิตทีละน้อย' },
	'home.heroSub': {
		en: 'Every piece starts as a length of cloth and a chalk line, not a production run. We cut what we can make well, and no more.',
		th: 'ทุกชิ้นเริ่มจากผืนผ้าและเส้นชอล์ก ไม่ใช่สายพานการผลิต เราตัดเท่าที่ทำได้ดีจริงๆ เท่านั้น',
	},
	'home.ctaCollection': { en: 'Explore the Collection', th: 'ดูคอลเลกชัน' },
	'home.ctaAbout': { en: 'About the Studio', th: 'รู้จักสตูดิโอ' },
	'home.studioHeadline': { en: 'A studio, not a factory.', th: 'เราคือสตูดิโอ ไม่ใช่โรงงาน' },
	'home.studioBody': {
		en: "Every order is planned around what we can actually make well — not scaled to meet demand. If a piece sells out, the next cut arrives when it's ready, not on a schedule.",
		th: 'ทุกออเดอร์วางแผนตามกำลังที่ทำได้จริง ไม่ได้เร่งผลิตตามดีมานด์ ถ้าชิ้นไหนหมด รอบตัดใหม่จะมาเมื่อพร้อมจริงๆ ไม่ใช่ตามตารางเวลา',
	},
	'home.quote': {
		en: "We'd rather make thirty pieces we're proud of than three thousand we're not.",
		th: 'เราขอทำแค่สามสิบชิ้นที่ภูมิใจ ดีกว่าทำสามพันชิ้นที่ไม่ได้ภูมิใจเลย',
	},
	'home.craft1Title': { en: 'Cut by hand', th: 'ตัดด้วยมือ' },
	'home.craft1Body': {
		en: 'Every pattern is laid and cut by a person, not a machine line.',
		th: 'ทุกแพทเทิร์นวางและตัดโดยคนจริงๆ ไม่ใช่สายการผลิตเครื่องจักร',
	},
	'home.craft2Title': { en: 'Numbered, not mass-produced', th: 'มีเลขกำกับ ไม่ใช่งานล็อตใหญ่' },
	'home.craft2Body': {
		en: "Each collection runs in limited quantities, then it's gone.",
		th: 'แต่ละคอลเลกชันผลิตจำนวนจำกัด พอหมดคือหมดเลย',
	},
	'home.craft3Title': { en: 'Built to outlast the season', th: 'ใส่ได้นานเกินหนึ่งฤดูกาล' },
	'home.craft3Body': {
		en: 'Fabric and construction chosen for years, not one wear.',
		th: 'เลือกผ้าและวิธีตัดเย็บให้ใส่ได้เป็นปี ไม่ใช่แค่ใส่ครั้งเดียว',
	},
	'home.scatterHeading': { en: 'Worn, not just sold.', th: 'ใส่จริง ไม่ใช่แค่วางขาย' },
	'home.scatterEyebrow': { en: 'Now in the Studio', th: 'มีที่สตูดิโอตอนนี้' },
	'home.scatterShop': { en: 'Shop the Collection →', th: 'ดูคอลเลกชัน →' },
	'home.scatterCtaTitle': { en: 'View the full Collection', th: 'ดูคอลเลกชันทั้งหมด' },
	'home.scatterCtaSub': {
		en: 'Every piece, with real photos and prices.',
		th: 'ครบทุกชิ้น พร้อมรูปจริงและราคา',
	},
	'home.closingHeadline': {
		en: "See a piece in person before it's spoken for.",
		th: 'มาดูของจริงที่สตูดิโอ ก่อนชิ้นที่ชอบจะหมด',
	},

	// ---- Collection ----
	'collection.eyebrow': { en: 'The Collection', th: 'คอลเลกชัน' },
	'collection.title': { en: 'Cut in limited numbers.', th: 'ตัดในจำนวนจำกัด' },
	'collection.lead': {
		en: "Everything shown here is made in small runs. Once a size or piece sells out, it's retired until the next cut — we don't restock mid-season.",
		th: 'ทุกชิ้นที่เห็นผลิตทีละล็อตเล็กๆ พอไซส์หรือชิ้นไหนหมด ก็จะพักไว้จนกว่าจะตัดรอบใหม่ เราไม่เติมสต็อกระหว่างซีซัน',
	},

	// ---- About ----
	'about.eyebrow': { en: 'About the Studio', th: 'เกี่ยวกับสตูดิโอ' },
	'about.title': { en: 'Slow, on purpose.', th: 'ช้าเพราะตั้งใจให้ช้า' },
	'about.lead': {
		en: 'Studio Kath started from a simple frustration: most clothing is designed to be replaced. We wanted to make the opposite — pieces cut with enough care that replacing them never crosses your mind.',
		th: 'Studio Kath เกิดจากความรู้สึกอึดอัดง่ายๆ ว่าเสื้อผ้าส่วนใหญ่ถูกออกแบบมาให้ถูกทิ้งแล้วซื้อใหม่ เราอยากทำสิ่งที่ตรงข้ามกัน คือตัดเย็บให้ประณีตจนไม่มีเหตุผลต้องเปลี่ยนเลย',
	},
	'about.foundingEyebrow': { en: 'About Studio Kath', th: 'เรื่องราวของ Studio Kath' },
	'about.founding1': {
		en: "Founded in 2019, Studio Kath was born from a lifelong passion for bespoke tailoring. Inspired by our founder's mother, a skilled dressmaker, the brand was created to preserve the beauty and craftsmanship of made-to-measure clothing.",
		th: 'ก่อตั้งขึ้นในปี 2019 Studio Kath เกิดจากความรักในงานตัดเย็บที่สั่งตัดเฉพาะคนมาตลอดชีวิต ได้แรงบันดาลใจจากคุณแม่ของผู้ก่อตั้งที่เป็นช่างตัดเสื้อฝีมือดี แบรนด์นี้จึงเกิดขึ้นเพื่อรักษาความงามและฝีมือของงานตัดเย็บแบบวัดตัวจริงเอาไว้',
	},
	'about.founding2': {
		en: 'We believe there is something truly special about designing your own garment—choosing the fabric, creating a style that reflects your personality, and wearing clothing that is tailored to fit you perfectly. Every custom-made piece is unique, made exclusively for you.',
		th: 'เราเชื่อว่าการได้ออกแบบเสื้อผ้าของตัวเองมีเสน่ห์แบบที่หาไม่ได้จากที่ไหน ตั้งแต่เลือกผ้า เลือกทรงที่บ่งบอกความเป็นตัวเอง ไปจนถึงได้ใส่เสื้อผ้าที่พอดีตัวจริงๆ ทุกชิ้นที่สั่งตัดจึงมีหนึ่งเดียว และทำขึ้นเพื่อคุณคนเดียวเท่านั้น',
	},
	'about.founding3': {
		en: 'At Studio Kath, every design can be made to order, allowing each customer to experience the elegance, confidence, and individuality that only bespoke clothing can offer.',
		th: 'ที่ Studio Kath ทุกแบบสามารถสั่งตัดได้ตามต้องการ เพื่อให้ลูกค้าทุกคนได้สัมผัสความหรูหรา ความมั่นใจ และความเป็นตัวเองที่มีแค่ในเสื้อผ้าสั่งตัดเท่านั้น',
	},
	'about.storyHeadline': { en: 'One studio, one size of ambition.', th: 'สตูดิโอเดียว ความฝันขนาดที่พอดี' },
	'about.story1': {
		en: "We're not trying to become a big brand. Every piece that leaves the studio has been touched by hand at least three times — cut, sewn, and finished — by someone who'll tell you exactly why it's made the way it is.",
		th: 'เราไม่ได้ตั้งใจจะโตเป็นแบรนด์ใหญ่ ทุกชิ้นที่ออกจากสตูดิโอผ่านมือคนอย่างน้อยสามครั้ง คือตัด เย็บ และเก็บงาน โดยคนที่อธิบายได้ทุกจุดว่าทำไมถึงตัดเย็บแบบนี้',
	},
	'about.story2': {
		en: "That means we can only make so much in a season. We've made peace with that. It's the only way the quality stays honest.",
		th: 'นั่นแปลว่าเราผลิตได้จำนวนจำกัดในแต่ละซีซัน ซึ่งเราโอเคกับข้อจำกัดนี้ เพราะเป็นวิธีเดียวที่รักษาคุณภาพให้ซื่อตรงกับตัวเองได้จริง',
	},
	'about.processHeadline': { en: 'How a piece gets made', th: 'กว่าจะเป็นเสื้อผ้าหนึ่งชิ้น' },
	'about.step1Title': { en: 'Pattern', th: 'ออกแบบแพทเทิร์น' },
	'about.step1Body': {
		en: 'Every silhouette starts on paper, adjusted by hand against a dress form until the drape is right — not pulled from a stock block.',
		th: 'ทุกทรงเริ่มจากกระดาษ ปรับด้วยมือบนหุ่นจนผ้าทิ้งตัวสวยได้ที่ ไม่ใช่หยิบแพทเทิร์นสำเร็จรูปมาใช้',
	},
	'about.step2Title': { en: 'Cut', th: 'ตัด' },
	'about.step2Body': {
		en: "A single length of cloth, marked in chalk, cut by one person from start to finish. No two bolts lay quite the same, so no two cuts are either.",
		th: 'ผ้าหนึ่งผืนขีดด้วยชอล์ก ตัดโดยคนคนเดียวตั้งแต่ต้นจนจบ ผ้าแต่ละม้วนไม่เหมือนกันเป๊ะ การตัดแต่ละครั้งจึงไม่มีทางเหมือนกันร้อยเปอร์เซ็นต์',
	},
	'about.step3Title': { en: 'Sew', th: 'เย็บ' },
	'about.step3Body': {
		en: "Seams are set, pressed, and set again. Where a machine can't reach — a collar, a hem, a buttonhole — it's finished by hand.",
		th: 'ตะเข็บเย็บ รีด แล้วเย็บซ้ำอีกรอบ จุดที่จักรเข้าไม่ถึง อย่างปกเสื้อ ชายเสื้อ หรือรังดุม จะเก็บงานด้วยมือ',
	},
	'about.step4Title': { en: 'Number', th: 'ให้เลขกำกับ' },
	'about.step4Body': {
		en: 'Each finished piece is counted against the run and logged. When the numbers run out, that piece is retired until the next cut.',
		th: 'ทุกชิ้นที่เสร็จจะนับและบันทึกไว้ในแต่ละล็อต พอครบจำนวนแล้วก็จะพักไว้จนกว่าจะตัดรอบใหม่',
	},
	'about.closingHeadline': {
		en: 'Have a question about a piece, or want to visit the studio?',
		th: 'มีคำถามเรื่องสินค้า หรืออยากมาเยี่ยมสตูดิโอไหม?',
	},

	// ---- Contact ----
	'contact.eyebrow': { en: 'Get in Touch', th: 'ติดต่อเรา' },
	'contact.title': { en: "Let's talk about a piece.", th: 'มาคุยเรื่องเสื้อผ้ากัน' },
	'contact.lead': {
		en: "Whether you have a question about sizing, want to ask about a piece that's sold out, or you'd like to visit the studio — reach out directly, any way below.",
		th: 'ไม่ว่าจะสงสัยเรื่องไซส์ อยากถามถึงชิ้นที่หมดไปแล้ว หรืออยากแวะมาที่สตูดิโอ ทักเข้ามาได้เลยตามช่องทางด้านล่าง',
	},
	'contact.call': { en: 'Call', th: 'โทร' },
	'contact.email': { en: 'Email', th: 'อีเมล' },
	'contact.studio': { en: 'Studio', th: 'สตูดิโอ' },
	'contact.line': { en: 'Chat on Line', th: 'แชททาง Line' },
	'contact.follow': { en: 'Follow & Shop', th: 'ติดตามและช้อป' },

	// ---- Checkout: review / address ----
	'checkout.eyebrow': { en: 'Checkout', th: 'ชำระเงิน' },
	'checkout.title': { en: 'Review your order.', th: 'ตรวจสอบคำสั่งซื้อ' },
	'checkout.shippingDetails': { en: 'Shipping details', th: 'ที่อยู่จัดส่ง' },
	'checkout.fullName': { en: 'Full name', th: 'ชื่อ-นามสกุล' },
	'checkout.address': { en: 'Address', th: 'ที่อยู่' },
	'checkout.houseNo': { en: 'House No.', th: 'บ้านเลขที่' },
	'checkout.village': { en: 'Village / Building', th: 'หมู่บ้าน/อาคาร' },
	'checkout.soi': { en: 'Soi', th: 'ซอย' },
	'checkout.road': { en: 'Road', th: 'ถนน' },
	'checkout.subdistrict': { en: 'Subdistrict', th: 'ตำบล/แขวง' },
	'checkout.district': { en: 'District', th: 'อำเภอ/เขต' },
	'checkout.province': { en: 'Province', th: 'จังหวัด' },
	'checkout.postalCode': { en: 'Postal Code', th: 'รหัสไปรษณีย์' },
	'checkout.addressNote': {
		en: "Leave any field blank if it doesn't apply.",
		th: 'ช่องไหนไม่มีก็ข้ามไปได้เลย',
	},
	'checkout.postcodeError': {
		en: 'Enter a valid 5-digit Thai postal code.',
		th: 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (5 หลัก)',
	},
	'checkout.phone': { en: 'Phone', th: 'เบอร์โทร' },
	'checkout.saveNote': {
		en: "Saved on this device — it'll fill in automatically next time you order.",
		th: 'ระบบจะจำไว้ในเครื่องนี้ ครั้งหน้าไม่ต้องกรอกใหม่',
	},
	'checkout.continueToPayment': { en: 'Continue to Payment', th: 'ไปหน้าชำระเงิน' },
	'checkout.cartEmpty': { en: 'Your cart is empty.', th: 'ยังไม่มีสินค้าในตะกร้า' },

	// ---- Checkout confirm dialog ----
	'checkoutConfirm.title': {
		en: 'Please read before continuing',
		th: 'กรุณาอ่านก่อนดำเนินการต่อ',
	},
	'checkoutConfirm.bullet1': {
		en: 'Please double-check your shipping address before paying — it cannot be changed afterward.',
		th: 'กรุณาตรวจสอบที่อยู่จัดส่งให้ถูกต้องก่อนกดชำระเงิน เนื่องจากไม่สามารถแก้ไขภายหลังได้',
	},
	'checkoutConfirm.bullet2': {
		en: "Please double-check your size — if you're unsure, feel free to ask our admin anytime.",
		th: 'กรุณาตรวจสอบขนาดของสินค้าให้เรียบร้อย หรือหากไม่แน่ใจ สามารถสอบถามแอดมินได้ตลอดเวลา',
	},
	'checkoutConfirm.bullet3': {
		en: 'We do not accept returns or exchanges for reasons of personal fit or preference after wearing.',
		th: 'ทางร้านขอสงวนสิทธิ์การคืน หรือเปลี่ยนสินค้า เนื่องจากเหตุผลใส่แล้วไม่เหมาะกับลูกค้า',
	},
	'checkoutConfirm.bullet4': {
		en: 'Size exchanges are accepted within 7 days, with the item and tags in original condition — we\'ll ship the replacement within 7–10 business days.',
		th: 'สามารถเปลี่ยนไซส์ได้ภายใน 7 วัน โดยสินค้าและป้าย TAG ต้องอยู่ในสภาพเดิม ทางร้านจะจัดส่งไปเปลี่ยนภายใน 7-10 วันทำการ',
	},
	'checkoutConfirm.bullet5': {
		en: 'For made-to-order trousers or any other questions, add us on LINE OFFICIAL: @studiokath',
		th: 'สั่งตัดกางเกงตามไซส์ และสอบถามรายละเอียดอื่นๆ เพิ่มเติม สามารถแอด LINE OFFICIAL: @studiokath',
	},
	'checkoutConfirm.proceed': { en: 'Go to Payment', th: 'ไปหน้าชำระเงิน' },

	// ---- Checkout: payment ----
	'payment.title': { en: 'Choose how to pay.', th: 'เลือกวิธีชำระเงิน' },
	'payment.order': { en: 'Order', th: 'คำสั่งซื้อ' },
	'payment.tabQr': { en: 'PromptPay QR', th: 'พร้อมเพย์ QR' },
	'payment.tabBank': { en: 'Bank Transfer', th: 'โอนผ่านธนาคาร' },
	'payment.qrNote': {
		en: 'Scan with your banking app — the amount is filled in automatically.',
		th: 'สแกนด้วยแอปธนาคารของท่าน ระบบใส่จำนวนเงินให้อัตโนมัติ',
	},
	'payment.bankLabel': { en: 'Bank', th: 'ธนาคาร' },
	'payment.accountNameLabel': { en: 'Account name', th: 'ชื่อบัญชี' },
	'payment.accountNumberLabel': { en: 'Account number', th: 'เลขบัญชี' },
	'payment.bankNote': {
		en: 'Transfer the exact total above, then confirm below.',
		th: 'โอนตามยอดด้านบนให้ครบ แล้วกดยืนยันด้านล่าง',
	},
	'payment.confirm': { en: "I've Completed Payment", th: 'ฉันชำระเงินแล้ว' },
	'payment.confirmNote': {
		en: "We'll confirm your payment shortly — no need to send a slip separately.",
		th: 'ทางร้านจะตรวจสอบการชำระเงินให้ ไม่ต้องส่งสลิปแยกมาอีก',
	},
	'payment.empty': { en: 'No order in progress.', th: 'ไม่มีคำสั่งซื้อที่กำลังดำเนินการ' },

	// ---- Checkout: complete ----
	'complete.eyebrow': { en: 'Thank You', th: 'ขอบคุณค่ะ' },
	'complete.titleTemplate': { en: 'Order received, {name}.', th: 'รับคำสั่งซื้อของคุณ {name} แล้วค่ะ' },
	'complete.leadTemplate': {
		en: "We'll confirm your payment shortly and be in touch about shipping. Your order number is {orderId} — total {total}.",
		th: 'เราจะตรวจสอบการชำระเงินและติดต่อเรื่องการจัดส่งในเร็วๆ นี้ หมายเลขคำสั่งซื้อของท่านคือ {orderId} ยอดรวม {total}',
	},
	'complete.empty': { en: 'No recent order found.', th: 'ไม่พบคำสั่งซื้อล่าสุด' },
	'complete.continueShopping': { en: 'Continue Shopping', th: 'ช้อปต่อ' },

	// ---- Privacy notice ----
	'privacy.eyebrow': { en: 'Privacy Notice', th: 'นโยบายความเป็นส่วนตัว' },
	'privacy.title': { en: 'Privacy Notice', th: 'นโยบายความเป็นส่วนตัว' },
	'privacy.lead': {
		en: 'This notice explains how Studio Kath collects, uses, and protects your personal data, in line with the Personal Data Protection Act B.E. 2562 (PDPA).',
		th: 'ฉบับนี้อธิบายว่า Studio Kath เก็บ ใช้ และดูแลข้อมูลส่วนบุคคลของท่านอย่างไร ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
	},
	'privacy.h1': { en: '1. Information We Collect', th: '1. ข้อมูลที่เราเก็บ' },
	'privacy.h1.p1': {
		en: 'When you place an order, we ask for your name, shipping address, and phone number through the checkout form — nothing more.',
		th: 'เมื่อท่านสั่งซื้อสินค้า เราขอข้อมูลจากท่านผ่านแบบฟอร์มชำระเงิน (Checkout) ได้แก่ ชื่อ-นามสกุล, ที่อยู่จัดส่ง, และเบอร์โทรศัพท์ เท่านั้น',
	},
	'privacy.h1.p2': {
		en: "We don't use cookies or marketing trackers on this site. Your cart and order details are stored only in your own browser (local storage), so your information fills back in the next time you order.",
		th: 'เราไม่ใช้คุกกี้หรือระบบติดตามพฤติกรรมเพื่อการตลาดบนเว็บไซต์นี้ ข้อมูลตะกร้าสินค้าและคำสั่งซื้อของท่านจะถูกเก็บไว้ในเบราว์เซอร์ของอุปกรณ์ที่ท่านใช้งานเท่านั้น (local storage) เพื่อให้ท่านกลับมาดูตะกร้าหรือกรอกข้อมูลซ้ำได้สะดวกในครั้งถัดไป',
	},
	'privacy.h2': { en: '2. Purpose & Legal Basis', th: '2. วัตถุประสงค์และฐานทางกฎหมาย' },
	'privacy.h2.p1': {
		en: "We use the information above only to ship your order and to contact you about that order or delivery issues — never for marketing or any other purpose.",
		th: 'เราใช้ข้อมูลข้างต้นเพื่อจัดส่งสินค้าตามคำสั่งซื้อ และติดต่อท่านกรณีมีปัญหาเกี่ยวกับคำสั่งซื้อหรือการจัดส่งเท่านั้น ไม่นำไปใช้เพื่อการตลาดหรือวัตถุประสงค์อื่น',
	},
	'privacy.h2.p2': {
		en: 'The legal basis is necessity for performing our contract of sale with you (Section 24(3) of the Personal Data Protection Act B.E. 2562).',
		th: 'ฐานทางกฎหมายคือความจำเป็นเพื่อปฏิบัติตามสัญญาซื้อขายระหว่างท่านกับทางร้าน (มาตรา 24(3) แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)',
	},
	'privacy.h3': { en: '3. Sharing With Third Parties', th: '3. การเปิดเผยข้อมูลต่อบุคคลที่สาม' },
	'privacy.h3.p1': {
		en: 'We share your name, address, and phone number only with the courier delivering your order. We never sell, rent, or share your data for marketing purposes.',
		th: 'เราเปิดเผยชื่อ ที่อยู่ และเบอร์โทรศัพท์ของท่านให้กับบริษัทขนส่งพัสดุที่ใช้จัดส่งสินค้าให้ท่านเท่านั้น เราไม่ขาย ไม่ให้เช่า และไม่แบ่งปันข้อมูลของท่านกับบุคคลภายนอกเพื่อวัตถุประสงค์ทางการตลาด',
	},
	'privacy.h4': { en: '4. Retention Period', th: '4. ระยะเวลาการเก็บรักษา' },
	'privacy.h4.p1': {
		en: 'We keep your information only as long as needed to fulfil your order and handle after-sales requests (such as a size exchange within 7 days). After that, you may request deletion as described in Section 5.',
		th: 'ข้อมูลจะถูกเก็บไว้เท่าที่จำเป็นเพื่อดำเนินการตามคำสั่งซื้อและติดตามหลังการขาย (เช่น การเปลี่ยนไซส์ภายใน 7 วัน) หลังจากนั้นท่านสามารถขอให้ลบข้อมูลได้ตามข้อ 5',
	},
	'privacy.h5': { en: '5. Your Rights', th: '5. สิทธิ์ของท่าน' },
	'privacy.h5.p1': {
		en: 'You may request to access, correct, or delete your personal data at any time by contacting us at info.studiokath@gmail.com or LINE OFFICIAL: @studiokath.',
		th: 'ท่านมีสิทธิ์ขอเข้าถึง แก้ไข หรือขอให้ลบข้อมูลส่วนบุคคลของท่านที่เราเก็บไว้ได้ทุกเมื่อ โดยติดต่อเราผ่านอีเมล info.studiokath@gmail.com หรือ LINE OFFICIAL: @studiokath',
	},
	'privacy.h5.p2': {
		en: 'If you believe we have processed your data unlawfully, you may file a complaint with the Personal Data Protection Committee (PDPC) at pdpc.or.th.',
		th: 'หากท่านเห็นว่าเราประมวลผลข้อมูลโดยไม่ชอบด้วยกฎหมาย ท่านมีสิทธิ์ร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC) ได้ที่ pdpc.or.th',
	},
	'privacy.h6': { en: '6. Contact Us', th: '6. ติดต่อเรา' },
	'privacy.h6.p1': {
		en: 'Studio Kath — 39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900',
		th: 'Studio Kath — 39/1 ซอยทองหล่อ 2 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
	},
	'privacy.h6.p2': { en: 'Email: info.studiokath@gmail.com', th: 'อีเมล: info.studiokath@gmail.com' },
	'privacy.updated': { en: 'Last updated: August 2026', th: 'ปรับปรุงล่าสุด: สิงหาคม 2569' },
};

export function t(key: string, lang: Lang): string {
	return dict[key]?.[lang] ?? dict[key]?.en ?? key;
}
