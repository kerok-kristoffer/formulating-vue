import {defineStore} from 'pinia'
import axios from "axios";
import User from "../types/User";
import SubPlan from "../types/SubPlan";
import Cookies from "js-cookie";
import {globalState} from '../main';
import {useRouter} from "vue-router";
import {ref} from "vue";
import {userData} from "./userData";

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
            seenVersionNotice: ref(Cookies.get('hasSeenNotice') === 'true'),
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
                if (userData().debug) {
                    console.log(error.message)
                }
            }).then((response) => {
                let latestVersion = response.data

                if (response.status === 200) {
                    if (latestVersion.version > this.version) {
                        this.notify("version can be updated", "success");
                        this.newVersionAvailable = true;
                        // TODO : implement version update, and set seenVersionNotice to false, to show new updates
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
                    if (userData().debug) {
                        console.log(error)
                    }
                    if (error.response.status === 401) {
                        this.notify("Invalid login or password", "error")
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
            if (userData().debug) {
                console.log("login successful")
            }
        },
        async register(inputs :any) {
            // TODO : implement registration, use api for axios call
            axios.post('users', inputs).then(async (response) => {
                if (response.status === 200) {
                    if (userData().debug) {
                        console.log(response)
                        console.log(response.data)
                        console.log(response.data.user)
                    }

                    let user = this.generateUser(response.data)
                    await this.setUser(user)
                    await this.router.push('/formulas')
                }
            }).catch((error) => {
                if (userData().debug) {
                    console.log(error)
                }
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
            Cookies.remove('dirtyCachedFormula');
            localStorage.removeItem('cachedFormula');
            localStorage.removeItem('dirtyCachedFormula');
            globalState.isAuthenticated = false
            if (userData().debug) {
                console.log("logout successful")
            }

            window.location.reload()
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
                if (userData().debug) {
                    console.log(response.data)
                }
                this.subPlan = SubPlan.fromResponseData(response.data);
                isActive = true;
            } catch (error) {
                if (userData().debug) {
                    console.log(error)
                }
            }
            return isActive;
        },
        getActiveSubscription() :SubPlan {
            return this.subPlan;
        },
        generateUser(userData) :User {
            return new User(
                userData.user.userName,
                userData.user.email,
                userData.user.fullName,
                new Date(userData.user.created_at),
                userData.access_token,
                userData.refresh_token,
                userData.user.StripeCustomerId);
        },
        setSeenNotice(isSeen: boolean) {
            this.seenVersionNotice = isSeen
            Cookies.set('hasSeenNotice', isSeen)
        }

    },
})