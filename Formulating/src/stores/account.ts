import {defineStore} from 'pinia'
import axios from "axios";
import Formula from "../types/Formula"

export const useAccountStore = defineStore('account', {
    state: () => {
        return  { 
            user: null,
            refreshToken: null,
            cachedFormula: null,
            notification: {
                message: "hello",
                show: false,
                type: 'success'
            }
         }
    },
    actions: {
        login(user, accessToken, refreshToken) {
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            this.user = user
            this.refreshToken = refreshToken
        },
        logout() {
            this.user = null
            this.refreshToken = null
            axios.defaults.headers.common['Authorization'] = ``
        },
        notify(message, type) {
            this.notification.show = true;
            this.notification.type = type;
            this.notification.message = message;

            setTimeout(() => {
                this.notification.show = false;
            }, 4000)
        },
        setCachedFormula(formula :Formula) {
            this.cachedFormula = formula;
        }
    },
})