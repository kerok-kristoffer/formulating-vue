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

          <!-- Pricing Section -->
          <div v-else class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">
            <h2 class="text-2xl lg:text-3xl font-semibold mb-4">Subscribe now for 30% off!</h2>
            <div
              class="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4"
            >
              <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
                <h3 class="text-lg lg:text-xl font-bold mb-2">Beta Monthly</h3>
                <p class="text-gray-600 mb-2 line-through">$7.5/month</p>
                <p class="text-gray-600 mb-4 text-2xl">$5.25/month</p>
                <p class="text-gray-600 mb-4">
                  Sign up before the end of the year using coupon code* YEAR2024 and get 30% off the
                  first 6 months
                </p>

                <stripe-buy-button
                  buy-button-id="buy_btn_1QRfN7AyAF7HunP4A1WWcjKA"
                  publishable-key="pk_live_51OPmhJAyAF7HunP4jDglwW09eX9oixSs91nlyxRt1VjxIxbmMihTAL2G7tSEwtWNoquaKHjCiY5aeHuLAxyo8AEK00kyKKMDMA"
                >
                </stripe-buy-button>
                <p class="text-xs italic">*Promo code expires on January 1st, 2025</p>
              </div>
              <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
                <h3 class="text-lg lg:text-xl font-bold mb-2">Beta Yearly</h3>
                <p class="text-gray-600 mb-2 line-through">$6.25/month</p>
                <p class="text-gray-600 mb-4 text-2xl">$4.38/month</p>
                <p class="text-gray-600 mb-4">
                  Sign up before the end of the year using coupon code* YEAR2024 and get 30% off the
                  first year
                </p>
                <stripe-buy-button
                  buy-button-id="buy_btn_1QRfVYAyAF7HunP4tIJ6Hweu"
                  publishable-key="pk_live_51OPmhJAyAF7HunP4jDglwW09eX9oixSs91nlyxRt1VjxIxbmMihTAL2G7tSEwtWNoquaKHjCiY5aeHuLAxyo8AEK00kyKKMDMA"
                >
                </stripe-buy-button>
                <p class="text-xs italic">*Promo code expires on January 1st, 2025</p>
              </div>
            </div>
          </div>
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
