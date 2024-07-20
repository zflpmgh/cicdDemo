
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import I18n from "./language/index"

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(I18n)

app.mount('#app')

console.log(import.meta);