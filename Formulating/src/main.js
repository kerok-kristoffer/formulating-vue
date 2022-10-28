import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Paginate from "vuejs-paginate-next";
import './interceptors/axios'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Paginate)

app.mount('#app')
