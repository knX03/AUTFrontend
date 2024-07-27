import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mitt from 'mitt'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();


const app = createApp(App)

app.use(router)
app.config.globalProperties.$axios = axios
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$EventBus = new mitt()
app.use(pinia);
pinia.use(piniaPluginPersistedstate)
app.mount('#app')
