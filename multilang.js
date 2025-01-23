// Call updateContent() on page load
window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
});

/**
 * Load language data
 * @param lang
 * @returns {Promise<any>}
 */
async function fetchLanguageData(lang) {
    const response = await fetch(`langs/${lang}.json`);
    return response.json();
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
        const key = element.getAttribute('data-i18n');
        const data = langData[key];
        if (typeof data === 'string') {
            element.textContent = langData[key];
        } else if (data instanceof Array) {
            let elements = element.getElementsByTagName('li')
            for (let i = 0; i < elements.length; i++) {
                elements[i].textContent = data[i];
            }
        }
    });
}