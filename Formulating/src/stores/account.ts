import {defineStore} from 'pinia'
import axios from "axios";
import Formula from "../types/Formula"
import Ingredient from "../types/Ingredient";

let currentVersion = import.meta.env.VITE_CURRENT_VERSION;
export const useAccountStore = defineStore('account', {
    state: () => {
        return  {
            version: currentVersion,
            newVersionAvailable: false,
            user: null,
            refreshToken: null,
            cachedFormula: null,
            cachedIngredients: [],
            notification: {
                message: "hello",
                show: false,
                type: 'success' // todo : see if these can utilize Enum kind of Types instead of Strings?
            }
         }
    },
    actions: {

        async versionCheck() {
            await axios.get("/version").catch((error) => {
                console.log(error.message)
            }).then((response) => {
                let latestVersion = response.data

                if (response.status === 200) {
                    if (latestVersion.version > this.version) {
                        this.notify("version can be updated", "success");
                        this.newVersionAvailable = true;
                    } else {
                        this.notify("already latest known version", "success");
                        this.newVersionAvailable = false;
                    }
                } else {
                    this.notify(response.statusText, "error");
                }
            });
        },

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
        },
        setCachedIngredients(ingredients :Ingredient[]) {
            this.cachedIngredients = ingredients
        }
    },
})