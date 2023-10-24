import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Paginate from 'vuejs-paginate-next'
import './interceptors/axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Paginate)

library.add(faSearch, faFileCircleExclamation)

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
