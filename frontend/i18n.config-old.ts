// i18n.config.ts
// frontend/i18n.config.ts
import { defineI18nConfig } from '#i18n'  // ← pridėk šitą

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    ru: {
      header: {
        brand: 'ORTOMEDICA',
        phone: '+7 (495) 609-63-86',
        login: 'Войти',
        account: 'Кабинет',
      },
      nav: {
        catalog: 'Каталог',
        about: 'О компании',
        certificates: 'Сертификаты',
        articles: 'Статьи',
        contacts: 'Контакты',
      },
      hero: {
        title: 'Ортопедическая продукция для всей семьи',
        cta: 'Перейти в каталог',
      },
      footer: '© 2025 ORTOMEDICA',
    },
  },
}))


// export default config
