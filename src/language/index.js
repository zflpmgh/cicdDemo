import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh_CN'
import enUS from './locales/en_US'
import Cache from '@/utils/cache'

let locale = Cache.get("MiguelLocale") || "en-us";

const i18n = createI18n({
    legacy: false,
    locale: locale,
    messages: {
        'zh-cn': zhCN,
        'en-us': enUS
    }
})

export default i18n;