// Call updateContent() on page load
window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = loadLocale();
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
});

/**
 * Load language preference
 * @returns {string}
 */
function loadLocale() {
    return localStorage.getItem('language') || (navigator.language || navigator.userLanguage).split('-')[0] || 'en';
}

/**
 * Load language data
 * @param lang
 * @returns {Promise<any>}
 */
async function fetchLanguageData(lang) {
    try {
        const response = await fetch(`langs/${lang}.json`);
        if (response.ok) {
            return response.json(); // 성공 시 즉시 반환
        }
        if (lang !== 'en') {
            console.warn(`Unable to find '${lang}.json'`);
        }
    } catch (error) {
        console.error(`Unable to load '${lang}.json'`, error);
    }

    try {
        const fallbackResponse = await fetch(`langs/en.json`);
        if (fallbackResponse.ok) {
            return fallbackResponse.json();
        }
    } catch (error) {
        console.error(error);
        return {};
    }
}

/**
 * Set language preference
 * @param lang
 */
function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

/**
 * Update content by language dynamically
 * @param langData
 */
function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keyPath = element.getAttribute('data-i18n');
        const keys = keyPath.split('.');
        const value = keys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, langData);
        if (typeof value === 'string') {
            element.textContent = value;
        } else if (Array.isArray(value)) {
            const listItems = element.getElementsByTagName('li');
            for (let i = 0; i < listItems.length; i++) {
                if (value[i]) {
                    listItems[i].textContent = value[i];
                }
            }
        }
    });
}