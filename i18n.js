let currentLang = 'ru';
let translations = {};

async function loadLang(lang) {
  const res = await fetch(`./locales/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  applyTranslations();
  document.documentElement.lang = lang;
  document.getElementById('lang-toggle').textContent = currentLang.toUpperCase();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.innerHTML = translations[key];
  });
}

function toggleLang() {
  loadLang(currentLang === 'ru' ? 'en' : 'ru');
}

loadLang('en');