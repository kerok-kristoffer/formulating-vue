import {defineStore} from 'pinia'
import axios from "axios";
import { useRouter } from "vue-router";

export const useAccountStore = defineStore('account', {
    state: () => {
        return  { 
            user: null,
         }
    },
    actions: {
        login(user) {

            this.user = user
        },
        logout() {
            this.user = null
            axios.defaults.headers.common['Authorization'] = ``
        }
    },
})