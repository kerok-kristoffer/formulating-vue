<script setup>
import { onMounted, ref } from 'vue'
import { useAccountStore } from '../stores/account'
import ButtonStandard from '@/components/ButtonStandard.vue'
import ProfileSettings from '@/components/ProfileSettings.vue'
import { userData } from '@/stores/userData'

const user = ref('')
const account = useAccountStore()
const currentSub = ref()

onMounted(() => {
  user.value = account.user
  currentSub.value = account.getActiveSubscription()

  const script = document.createElement('script')
  script.src = 'https://js.stripe.com/v3/buy-button.js'
  script.async = true
  document.body.appendChild(script)
})

function goToStripePortal() {
  window.open(currentSub.value.link, '_blank')
}

function showBetaNotice() {
  account.setSeenNotice(false)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-CA')
}
</script>

<template>
  <div v-if="account.user" class="flex flex-col md:w-7/12 mx-auto">
    <div class="flex flex-row h-24"></div>

    <div class="profile bg-slate-200 p-3 border-2 border-slate-400 rounded-md mb-5">
      <h1 class="text-lg font-bold">User</h1>
      <h2>Hello {{ user.fullName }}</h2>
      <p>User Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
    </div>

    <div v-if="currentSub">
      <div class="flex flex-col w-full mx-auto">
        <div class="profile bg-slate-200 p-3 rounded-md border-2 border-slate-400 mb-5">
          <h1 class="text-lg font-bold">Subscription</h1>
          <h2>{{ currentSub.name }}</h2>
          <p v-if="currentSub.name !== '7-day trial'">
            Sub cost: ${{ Number(currentSub.price).toFixed(2) }} /
            {{ currentSub.getSubFrequencyAsText() }}
          </p>
          <p v-if="currentSub.nextBillingDate !== 'none'">
            Next billing date: {{ formatDate(currentSub.nextBillingDate) }}
          </p>
          <p v-if="currentSub.name !== '7-day trial'">
            Current period start: {{ formatDate(currentSub.currentPeriodStart) }}
          </p>
          <p class="mb-3">Current period end: {{ formatDate(currentSub.currentPeriodEnd) }}</p>
          <ButtonStandard
            v-if="currentSub.name !== '7-day trial'"
            :text="'Manage Subscription'"
            @click="goToStripePortal"
          />
        </div>
      </div>
    </div>

    <ProfileSettings />

    <div class="profile bg-slate-200 p-3 border-2 border-slate-400 rounded-md mb-5">
      <h1 class="text-lg font-bold">Beta</h1>
      <h2 class="mb-2">Thank you for taking part in our early Beta</h2>
      <ButtonStandard :text="'Show Beta Notice'" @click="showBetaNotice" />
    </div>

    <div
      v-if="userData().debug"
      class="debug-info fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-2 border-slate-400 rounded-md p-2 shadow-md"
    >
      <p>seenBetaNotice: {{ account.seenVersionNotice }}</p>
    </div>
  </div>
</template>
