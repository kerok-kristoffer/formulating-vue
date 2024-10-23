<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAccountStore } from '../stores/account'
import ButtonStandard from '@/components/ButtonStandard.vue'
import { userData } from '@/stores/userData'
import UnitSelector from '@/components/UnitSelector.vue'
import ProfileSettings from "@/components/ProfileSettings.vue";

const user = ref('')
const account = useAccountStore()
const currentSub = ref()

const data = userData()
const formulaUnit = computed(() => data.settings.preferredUnits)

onMounted(() => {
  user.value = account.user
  currentSub.value = account.getActiveSubscription()
})

function goToStripePortal() {
  window.open(currentSub.value.link, '_blank')
}
</script>

<template>
  <div v-if="account.user" class="flex flex-col md:w-1/2 mx-auto">
    <div class="flex flex-row h-56"></div>

    <div class="profile bg-slate-200 p-3 border-2 border-slate-400 rounded-md mb-5">
      <h1 class="text-lg font-bold">Profile</h1>
      <h2>Hello {{ user.fullName }}</h2>
      <p>User Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
    </div>

    <!--    // TODO add subscription information here-->
    <div v-if="currentSub">
      <div class="flex flex-col w-full mx-auto">
        <div class="profile bg-slate-200 p-3 rounded-md border-2 border-slate-400 mb-5">
          <h1 class="text-lg font-bold">Subscription</h1>
          <h2>{{ currentSub.name }}</h2>
          <p>
            Sub cost: ${{ Number(currentSub.price).toFixed(2) }} /
            {{ currentSub.getSubFrequencyAsText() }}
          </p>
          <p>Next billing date: {{ new Date(currentSub.nextBillingDate).toLocaleDateString() }}</p>
          <p>
            Current period start: {{ new Date(currentSub.currentPeriodStart).toLocaleDateString() }}
          </p>
          <p>
            Current period end: {{ new Date(currentSub.currentPeriodEnd).toLocaleDateString() }}
          </p>
          <ButtonStandard :text="'Manage Subscription'" @click="goToStripePortal" />
        </div>
      </div>
    </div>
    <div v-else>Not subscribed</div>

    <ProfileSettings />
<!--    <div class="profile bg-slate-200 p-3 border-2 border-slate-400 rounded-md mb-5">
      <h1 class="text-lg font-bold">Options</h1>
      <p>Preferred Weight Unit:</p>
      <UnitSelector @unitSelected="data.setPreferredUnit(formulaUnit)" />
    </div>-->
  </div>
</template>
