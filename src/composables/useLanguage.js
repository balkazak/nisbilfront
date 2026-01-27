import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useLanguage() {
  const { locale, t: i18nT } = useI18n();

  const currentLang = computed(() => locale.value);

  const setLanguage = (lang) => {
    locale.value = lang;
    localStorage.setItem('lang', lang);
  };

  const t = (key, options = {}) => {
    return i18nT(key, options);
  };

  const format = (text, params) => {
    if (typeof text !== 'string') return text;
    let result = text;
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(`{${key}}`, value);
    }
    return result;
  };

  return {
    currentLang,
    setLanguage,
    t,
    format
  };
}
