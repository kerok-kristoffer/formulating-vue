import {defineStore} from 'pinia'
import axios from "axios";
import Formula from "../types/Formula"
import Ingredient from "../types/Ingredient";
import SubPlan, {AccessRank} from "../types/SubPlan";
import Cookies from "js-cookie";
import {globalState} from '../main';

let currentVersion = import.meta.env.VITE_CURRENT_VERSION;

export const useAccountStore = defineStore('account', {
    state: () => {
        return  {
            version: currentVersion,
            newVersionAvailable: false,
            user: null,
            subPlan: null,
            refreshToken: null,
            cachedFormula: null,
            cachedIngredients: [],
            keepLoggedIn: true,
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

        async login(user, accessToken, refreshToken) {
            if (this.keepLoggedIn) {
                await Cookies.set('accessToken', accessToken, { expires: 7 });
                await Cookies.set('refreshToken', refreshToken, { expires: 14 });
                await Cookies.set('user', user, { expires: 14 })

            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            this.user = user
            this.refreshToken = refreshToken
            globalState.isAuthenticated = true
            console.log("login successful")
        },
        logout() {
            this.user = null
            this.refreshToken = null
            axios.defaults.headers.common['Authorization'] = ``

            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            console.log("logout successful")
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
            console.log("setting cached formula: " + formula.name)
            this.cachedFormula = formula;
        },
        setCachedIngredients(ingredients :Ingredient[]) {
            this.cachedIngredients = ingredients
        },
        hasActiveSubscription(): boolean {
            // temporary implementation checking Cookie for sub until backend is ready
            if(Cookies.get('subscribed')) {
                this.subPlan = SubPlan.getDummySubPlans[Cookies.get('subscribed')];
                return true;
            }
            if (!this.subPlan) return false;
            const currentDate = new Date();
            return this.subPlan.accessRank > AccessRank.NONE && currentDate < this.subPlan.expiryDate;
        },
        setActiveSubscription(subPlan :SubPlan) {
            this.subPlan = subPlan;
            let dummySubPlanIndex = SubPlan.getDummySubPlans().indexOf(subPlan);
            console.log("setting dummy sub plan index to " + dummySubPlanIndex);
            Cookies.set('subscribed', dummySubPlanIndex, { expires: subPlan.expiryDate });
        },
        getActiveSubscription() :SubPlan {
            return this.subPlan;
        },

    },
})