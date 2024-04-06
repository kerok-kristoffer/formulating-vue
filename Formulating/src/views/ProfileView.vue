<script setup>
import { onMounted, ref } from 'vue'
import { useAccountStore } from '../stores/account'
import axios from 'axios'
import ButtonStandard from '@/components/ButtonStandard.vue'

const user = ref('')
const account = useAccountStore()
const currentSub = ref();

onMounted(async () => {
  user.value = account.user
  currentSub.value = account.getActiveSubscription();
})

const refreshToken = () => {
  axios.post('tokens/renew', { refresh_token: account.refreshToken }).then((response) => {
    console.log(response.data)

    if (response.status === 200) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
      account.notify('Token refreshed', 'success')
    } else {
      account.notify(response.statusText)
    }
  })
}

const versionCheck = () => {
  account.versionCheck()
}
</script>

<template>
  <div class="flex flex-col md:w-1/2 mx-auto">
    <div class="flex flex-row h-56"></div>

    <div class="profile bg-slate-200 p-3 rounded-md mb-5">
      <h1 class="text-lg font-bold">Profile</h1>
      <h2>Hello {{ user.fullName }}</h2>
      <p>User Name: {{ user.userName }}</p>
      <p>Email: {{ user.email }}</p>

      <div class="mt-3 flex flex-col justify-between gap-1">
        <button-standard :text="'refresh token'" @click="refreshToken" />
        <button-standard :text="'check version'" @click="versionCheck" />
      </div>
    </div>


<!--    // TODO add subscription information here-->
    <div v-if="currentSub">
      <div class="flex flex-col w-full mx-auto">
        <div class="profile bg-slate-200 p-3 rounded-md mb-5">
          <h1 class="text-lg font-bold">Subscription</h1>
          <h2>{{ currentSub.name }}</h2>
          <p>sub cost :  {{ currentSub.price }} / {{ currentSub.getSubFrequencyAsText() }}</p>
          <p>Valid until: {{ currentSub.expiryDate }}</p>
          <p>link to Stripe portal!</p>
          <ButtonStandard :text="'Cancel'" />
        </div>
      </div>
    </div>
<!--    // TODO add subscription options here, upgrade - etc-->
    <div v-else>Not subscribed</div>

    <!--
    <div class="flex flex-col w-full mx-auto">
      <div class="profile bg-slate-200 p-3 rounded-md mb-5">
          <h1 class="text-lg font-bold">Reset password</h1>
          <h2>previous password</h2>
          <input type="password" class="h-6 rounded-sm">
          
          <h2>new password</h2>
          <input type="password" class="h-6 rounded-sm">
          <h2>repeat password</h2>
          <input type="password" class="h-6 rounded-sm">

        <div class="">
          <button @click="updatePassword" 
          class="
          bg-slate-300 
            px-2 
            hover:bg-slate-400 
            my-2 
            rounded-md 
            font-semibold">update</button>
        </div>

      </div>
    </div>

    -->
  </div>
</template>
