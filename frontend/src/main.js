import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import BuyAdModel from './views/Shared/BuyAdModel.vue'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .component("buy-ad-modal", BuyAdModel)
  .mount('#app')
