<template>
  <main>
    <div>
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'
import Cookies from 'js-cookie'
import { watchEffect} from "vue";
import { globalState } from '@/main'
import SubPlan from "@/types/SubPlan";

watchEffect(() => {
  const account = useAccountStore()
  // TODO set a cookies hash instead with info stored on server instead of client - at least for sensitive info
  if (Cookies.get('accessToken') && Cookies.get('refreshToken') && Cookies.get('user')) {
    account.login(Cookies.get('user'), Cookies.get('accessToken'), Cookies.get('refreshToken'))
    if(account.hasActiveSubscription()) {
      if(Cookies.get('subscribed')) {
        console.log(Cookies.get('subscribed'));
        account.setActiveSubscription(SubPlan.getDummySubPlans()[Cookies.get('subscribed')]);
        console.log(account.getActiveSubscription())
        return true;
      }
    } else {
      globalState.hasActiveSubscription = false;
    }
    globalState.isAuthenticated = true;
    console.log('login successful through cookies')
  } else {
    globalState.isAuthenticated = false;
    console.log('no cookies found')
  }
})
</script>

<style>
@import './assets/base.css';
@import './assets/tailwind.css';
</style>
