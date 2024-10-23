import { defineStore } from 'pinia';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useAccountStore} from "./account";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: Cookies.get('accessToken') || null,
  }),
  actions: {
    async reAuthenticate() {
      if (this.token) {
        try {
          axios.get('users/auth/me', {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }).then (async (response) => {
            console.log(response.data);
            this.user = useAccountStore().generateUser(response.data);
            this.setToken(response.data.accessToken);
            await useAccountStore().setUser(this.user);
          });

        } catch (error) {
            console.error(error);
          this.logout();
        }
      }
    },
    setToken(token: string) {
      this.token = token;
      Cookies.set('accessToken', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      Cookies.remove('accessToken');
    },
  },
});