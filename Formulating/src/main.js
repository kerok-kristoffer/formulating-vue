import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Paginate from 'vuejs-paginate-next'
import './interceptors/axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
// import { faYoutube, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

import {
  faSearch, // add icons plus, trashcan, save icon, new icon.
  faFileCircleExclamation,
  faFolder,
  faFileLines,
  faCircleXmark,
  faGears,
  faPlus,
  faTrashCan,
  faFloppyDisk,
  faFileCirclePlus,
  faPrint,
  faCopy,
  faCircleInfo,
  faLock,
  faLockOpen,
    faThumbtack,
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

app.directive('tooltip', {
  beforeMount(el, binding) {
    tippy(el, {
      content: binding.value,
      placement: 'bottom',
      animation: 'scale',
      theme: 'light',
      delay: [500, 100]
    })
  },
  updated(el, binding) {
    tippy(el, {
      content: binding.value
    })
  },
  unmounted(el) {
    tippy(el).destroy()
  }
})

library.add(
  faSearch,
  faFileCircleExclamation,
  faFolder,
  faFileLines,
  faCircleXmark,
  faGears,
  faPlus,
  faTrashCan,
  faFloppyDisk,
  faFileCirclePlus,
  faPrint,
  faCopy,
  faCircleInfo,
  faLock,
  faLockOpen,
    faThumbtack,
    // faFacebook,
    // faInstagram,
    // faYoutube
)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
