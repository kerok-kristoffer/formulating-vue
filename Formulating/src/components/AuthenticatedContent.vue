<template>
  <div v-if="loaded && account.hasActiveSubscription()">
    <router-view :key="$route.path"></router-view>
    <BetaNotice />
  </div>

  <div v-else-if="loaded && !account.hasActiveSubscription()" class="mt-6 text-center">
    <h1 class="text-3xl font-bold">You are not subscribed</h1>
    <p class="text-xl my-10">Select a plan and start our free 7 day trial!</p>
    <stripe-pricing-table
      pricing-table-id="prctbl_1OPpFrAyAF7HunP402hUvSnq"
      publishable-key="pk_test_51OPmhJAyAF7HunP4DqO9w7K5RQkXCn6q3Ewlm6R1JXOoQfADP4cnLYSjK31CEsYnuXV9ZytvRxY79BYYi8um5o5s00Y0S9dEu7"
      success-url="https://mysatchel-e2f78.web.app/success?session_id={CHECKOUT_SESSION_ID}"
      return-url="https://mysatchel-e2f78.web.app/success?session_id={CHECKOUT_SESSION_ID}"

    >
    </stripe-pricing-table>
    <ButtonStandard :text="'LocalBypass'" @click="account.setActiveSubscription(SubPlan.getDummySubPlans()[2]);" />
    <!--    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-3xl font-bold">You are not subscribed</h1>
      <p class="text-xl">Please subscribe to use this app</p>
      <div class="flex flex-col md:flex-row w-4/5 gap-6">
        <ul class="flex w-full border-2 rounded-md border-slate-400" v-bind:key="plan.id" v-for="plan in SubPlan.getDummySubPlans()">
          <li class="justify-center text-center w-full">
            <div class="flex flex-col w-full h-48 justify-around">
              <p>{{plan.name}}</p>
              <p>cost: {{plan.price}}</p>
              <p>{{plan.description}}</p>
              <p><ButtonStandard :text="'subscribe'" @click="account.setActiveSubscription(plan)"/></p>
            </div>
          </li>
        </ul>
      </div>
    </div>-->
  </div>
  <div v-else>
    <LoadingIndicator />
  </div>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'
import { userData } from '@/stores/userData'
import { onMounted, ref } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'
import ButtonStandard from '@/components/ButtonStandard.vue'
import BetaNotice from '@/components/BetaNotice.vue'
import SubPlan from '@/types/SubPlan'

const account = useAccountStore()
const data = userData()
let loaded = ref(false)

onMounted(async () => {
  await data.ingredientList.populateWithTags()
  await data.formulaList.populate()
  loaded.value = true
})
</script>
