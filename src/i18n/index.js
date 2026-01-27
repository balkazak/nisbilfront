import { createI18n } from 'vue-i18n';
import ru from './locales/ru.json';
import kk from './locales/kk.json';

const i18n = createI18n({
  legacy: false, // use Composition API
  locale: localStorage.getItem('lang') || 'ru',
  fallbackLocale: 'ru',
  messages: {
    ru,
    kk,
  },
});

export default i18n;
