import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../resources/lang/en.json'
import ro from '../resources/lang/ro.json'

i18n.use(initReactI18next).init({
  resources: {
    ro: { translation: ro },
    en: { translation: en },
  },
  fallbackLng: 'ro',
  interpolation: {
    escapeValue: true,
  },
})

export default i18n
