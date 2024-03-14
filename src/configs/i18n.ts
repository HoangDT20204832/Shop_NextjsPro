import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from "i18next-http-backend"

i18n
  
  .use(Backend)  // sử dụng backend từ máy chủ (locales) thì mới hoạt động
  
  // Enable automatic language detection
  .use(LanguageDetector)  //giúp server biết được ngôn ngữ đã thay đổi hay chưa

  // Enables the hook initialization module
  .use(initReactI18next)   //khởi tạo i18net với react
  .init({
    lng: 'vi',  //ngôn nwgxu ban đầu là : "en"
    backend: {
      /* translation file path */
      loadPath: '/locales/{{lng}}.json'
    },
    fallbackLng: 'vi',  //nếu ko có set ngôn ngữ đầu thì sẽ lấy giá trị mặc định là "en"
    debug: false,
    keySeparator: false,  
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n


export const LANGUAGE_OPTIONS=[
  {
    lang: "Tiếng Việt",
    value: "vi"
  },
  {
    lang: "English",
    value: "en"
  }
]