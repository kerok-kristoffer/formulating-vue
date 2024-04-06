import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Paginate from 'vuejs-paginate-next'
import './interceptors/axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSearch,
  faFileCircleExclamation,
  faFolder,
  faFileLines,
  faCircleXmark,
    faGears
} from '@fortawesome/free-solid-svg-icons'
export const globalState = reactive({
  isAuthenticated: false
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Paginate)
app.provide('globalState', globalState)

library.add(faSearch, faFileCircleExclamation, faFolder, faFileLines, faCircleXmark, faGears)

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
