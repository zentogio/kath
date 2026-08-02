import { dict } from '../i18n/dict';
import { getLang, setLang, onLangChange } from '../i18n/state';
import { products, productName, productBlurb, productDetails } from '../data/products';

function applyStaticText(lang: 'en' | 'th') {
	document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
		const key = el.dataset.i18n as string;
		const entry = dict[key];
		if (entry) el.innerHTML = entry[lang];
	});

	document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
		const spec = el.dataset.i18nAttr as string;
		const [attr, key] = spec.split(':');
		const entry = key ? dict[key] : undefined;
		if (entry && attr) el.setAttribute(attr, entry[lang]);
	});
}

// Product name/blurb/details rendered by Astro components at build time
// (English only) — swapped client-side by looking the product back up from
// the same data module the pages were built from.
function applyProductText(lang: 'en' | 'th') {
	document.querySelectorAll<HTMLElement>('[data-i18n-name]').forEach((el) => {
		const product = products.find((p) => p.id === el.dataset.i18nName);
		if (product) el.textContent = productName(product, lang);
	});
	document.querySelectorAll<HTMLElement>('[data-i18n-blurb]').forEach((el) => {
		const product = products.find((p) => p.id === el.dataset.i18nBlurb);
		if (product) el.textContent = productBlurb(product, lang);
	});
	document.querySelectorAll<HTMLElement>('[data-i18n-details]').forEach((el) => {
		const product = products.find((p) => p.id === el.dataset.i18nDetails);
		if (product) el.textContent = productDetails(product, lang);
	});
}

function updateToggleButtons(lang: 'en' | 'th') {
	document.querySelectorAll<HTMLElement>('[data-lang-set]').forEach((btn) => {
		btn.classList.toggle('is-active', btn.dataset.langSet === lang);
	});
}

function applyAll(lang: 'en' | 'th') {
	document.documentElement.lang = lang;
	applyStaticText(lang);
	applyProductText(lang);
	updateToggleButtons(lang);
}

function initToggle() {
	document.querySelectorAll<HTMLElement>('[data-lang-set]').forEach((btn) => {
		btn.addEventListener('click', () => {
			const lang = btn.dataset.langSet === 'th' ? 'th' : 'en';
			if (lang !== getLang()) setLang(lang);
		});
	});
}

applyAll(getLang());
initToggle();
onLangChange((lang) => applyAll(lang));
