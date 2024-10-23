import {defineStore} from 'pinia'
import axios from "axios";
import User from "../types/User";
import SubPlan, {AccessRank} from "../types/SubPlan";
import Cookies from "js-cookie";
import {globalState} from '../main';
import {useRouter} from "vue-router";

let currentVersion = import.meta.env.VITE_CURRENT_VERSION;

export const useAccountStore = defineStore('account', {
    state: () => {
        return  {
            version: currentVersion,
            newVersionAvailable: false,
            subPlan: null,
            refreshToken: null,
            cachedIngredients: [],
            keepLoggedIn: true,
            isLoading: false,
            router :useRouter(),
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
        async login(credentials, apiCreds) {
            axios.defaults.headers.common['Authorization'] = `Bearer `

            this.isLoading = true
            await axios.post('users/login', credentials,
                {withCredentials: apiCreds})
                .then(async (response) => {
                    let user = this.generateUser(response.data)
                    await this.setUser(user)
                    await this.router.push('/formulas')
                })
                .catch((error) => {
                    console.log(error)
                    if (error.status === 401) {
                        this.notify("Invalid credentials", "error")
                    } else {
                        this.notify("Something went wrong, try again later", "error")
                    }
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        async setUser(user :User) {
            if (this.keepLoggedIn) {
                await Cookies.set('user', JSON.stringify(user), { expires: 14 })
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`
            this.user = user
            this.refreshToken = user.refreshToken
            globalState.isAuthenticated = true
            Cookies.set('accessToken', user.accessToken)
            Cookies.set('refreshToken', user.refreshToken)
            Cookies.set('user', JSON.stringify(user))
            console.log("login successful")
        },
        async register(inputs :any) {
            // TODO : implement registration, use api for axios call
            axios.post('users', inputs).then(async (response) => {
                if (response.status === 200) {
                    console.log(response)
                    console.log(response.data)
                    console.log(response.data.user)

                    let user = this.generateUser(response.data)
                    await this.setUser(user)
                    this.router.push('/formulas')
                }
            }).catch((error) => {
                console.log(error)
                this.notify("Registration failed: " + error.response.data.error, "error")
                throw error
            })
        },
        async logout() {
            this.user = null
            this.refreshToken = null
            axios.defaults.headers.common['Authorization'] = ``

            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            Cookies.remove('cachedFormula');
            globalState.isAuthenticated = false
            console.log("logout successful")
        },
        notify(message, type) {
            this.notification.show = true;
            this.notification.type = type;
            this.notification.message = message;

            setTimeout(() => {
                this.notification.show = false;
            }, 4500)
        },
        async hasActiveSubscription(): Promise<boolean> {
            let isActive = false;
            try {
                const response = await axios.get("users/sub/info");
                console.log(response.data)
                this.subPlan = SubPlan.fromResponseData(response.data);
                isActive = true;
            } catch (error) {
                console.log(error)
            }
            return isActive;
        },
        getActiveSubscription() :SubPlan {
            return this.subPlan;
        },
        generateUser(userData) :User {
            console.log("userData", userData.user)
            return new User(
                userData.user.userName,
                userData.user.email,
                userData.user.fullName,
                new Date(userData.user.created_at),
                userData.access_token,
                userData.refresh_token,
                userData.user.StripeCustomerId);
        }

    },
})