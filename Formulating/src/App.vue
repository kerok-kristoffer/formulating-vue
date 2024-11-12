<template>
  <main :class="{ dark: isDarkMode }">
    <div>
      <RouterView class="dark:text-textColorDarkMode" />
      <Notification />
      <CookieNotice />
    </div>
  </main>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'
import Cookies from 'js-cookie'
import { ref, watchEffect } from 'vue'
import { globalState } from '@/main'
import { useAuthStore } from '@/stores/auth'
import Notification from "@/components/Notification.vue";
import CookieNotice from "@/components/CookieNotice.vue";
import {userData} from "@/stores/userData";

const isDarkMode = ref(true)

watchEffect(async () => {
  const account = useAccountStore()
  // TODO set a cookies hash instead with info stored on server instead of client - at least for sensitive info
  if (Cookies.get('accessToken') && Cookies.get('refreshToken') && Cookies.get('user')) {
    account.setUser(JSON.parse(Cookies.get('user'))) // TODO check if this is necessary, do we want to store user info in cookies, or retreive from server?
    globalState.isAuthenticated = true
    if (userData().debug) {
      console.log('login successful through cookies')
    }
  } else if (Cookies.get('accessToken')) {
    if (userData().debug) {
      console.log('Only access token found')
      console.log('reauthenticating')
    }
    await useAuthStore().reAuthenticate()
    if (userData().debug) {
      console.log('reauth successful through store')
    }
    globalState.isAuthenticated = true
  } else {
    globalState.isAuthenticated = false
    if (userData().debug) {
      console.log('no cookies found')
    }
  }
})
</script>

<style>
@import './assets/base.css';
@import './assets/tailwind.css';
</style>
