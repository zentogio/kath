import type { Lang } from './dict';

const STORAGE_KEY = 'studio-kath-lang';

export function getLang(): Lang {
	try {
		return localStorage.getItem(STORAGE_KEY) === 'th' ? 'th' : 'en';
	} catch {
		return 'en';
	}
}

export function setLang(lang: Lang) {
	try {
		localStorage.setItem(STORAGE_KEY, lang);
	} catch {
		// non-critical — falls back to English next load
	}
	window.dispatchEvent(new CustomEvent<{ lang: Lang }>('lang:change', { detail: { lang } }));
}

export function onLangChange(callback: (lang: Lang) => void) {
	window.addEventListener('lang:change', ((event: CustomEvent<{ lang: Lang }>) => {
		callback(event.detail.lang);
	}) as EventListener);
}
