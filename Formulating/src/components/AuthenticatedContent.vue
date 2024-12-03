<template>
  <div v-if="loaded && authorized">
    <router-view :key="$route.path"></router-view>
    <BetaNotice />
    <AlertPopup
      v-if="userData().alert.state.visible"
      :promptText="userData().alert.state.message"
      :callback="userData().alert.state.callback"
      @yes-click="userData().alert.yesClick"
      @no-click="userData().alert.noClick"
      @cancel-click="userData().alert.cancelClick"
    />
  </div>

  <div v-else-if="loaded && !authorized" class="mt-6 text-center">
    <h1 class="text-3xl font-bold">Welcome to mySatchel</h1>

    <p class="mt-2">
      Get a sneak peek tutorial series on our Youtube channel
      <a
        href="https://www.youtube.com/playlist?list=PLDxjUdNDZ676dXEKCq6GqGyYI0xJEyxP0"
        class="text-blue-500 underline hover:text-blue-700"
        target="_blank"
      >
        Click here to see
      </a>
    </p>
    <p class="text-xl my-10">Select a plan!</p>
    <p class="text-xl mb-10">Sign up yearly and <strong>get 2 months free!</strong></p>
    <stripe-pricing-table
      pricing-table-id="prctbl_1QB66gAyAF7HunP427mYj67X"
      publishable-key="pk_live_51OPmhJAyAF7HunP4jDglwW09eX9oixSs91nlyxRt1VjxIxbmMihTAL2G7tSEwtWNoquaKHjCiY5aeHuLAxyo8AEK00kyKKMDMA"
      ><!-- return url set in Stripe dashboard under pricing table-->
    </stripe-pricing-table>
    <p class="text-xs italic">
      Payment Processing Notice: All payments are securely processed through Stripe on behalf of
      Kerok Tech LLC.
    </p>
  </div>
  <div v-else>
    <LoadingIndicator />
  </div>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'
import { onMounted, ref } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'
import BetaNotice from '@/components/BetaNotice.vue'
import AlertPopup from '@/components/AlertPopup.vue'
import { userData } from '@/stores/userData'

const account = useAccountStore()
let loaded = ref(false)
let authorized = ref(false)

onMounted(async () => {
  // TODO need to add a check for no connection to the server before auth step and show proper error.
  authorized.value = await account.hasActiveSubscription()

  loaded.value = true
})
</script>
