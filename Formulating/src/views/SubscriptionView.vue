<template>

<!--  <main>
    <div class="flex flex-col m-3 justify-center">
      <div class="flex w-1/2 m-auto">
        <h2 class="text-lg font-bold">Choose a subscription plan!</h2>
      </div>
&lt;!&ndash;       dynamically load from Subscriptions.ts and show all options as a list of cards&ndash;&gt;
      <ul v-for="sub in subscriptions">

        <div class="flex flex-row justify-center">
          <div class="flex flex-col w-1/2 m-auto">
            <div class="flex flex-col w-full mx-auto">
              <div class="profile bg-slate-200 p-3 rounded-md mb-5">
                <h1 class="text-lg font-bold">{{ sub.name }}</h1>
                <h2>{{ sub.cost }} | {{ sub.interval }}</h2>
                <p>{{ sub.description }}</p>
                <button-standard :text="'subscribe'" @click="subscribe" />
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </main>-->
</template>

<script >
</script>
<!--<script setup lang="ts">
import axios from 'axios'
import { ref, onBeforeMount } from 'vue'
import { useAccountStore } from '../stores/account'

const loading = ref(false)

// let stripe = Stripe(
//   'pk_test_51MAT5eHMUUCVzLHGkctuDt3QuEfYgWR82qK8RwRcjaPSU93Dz4MtutgQRtSbGGbhQJpUNCSz4Gxl61frkTcmPh1h008OSU71Al'
// )

let account = useAccountStore() // kerok: add Stripe portal button, should be visible for users with an active sub. Get link from backend?
// Can these be static, or will they change depending on which subscription is chosen?
let successURL = 'https://mysatchel-e2f78.web.app/success'
let cancelURL = 'https://mysatchel-e2f78.web.app/cancel'
// TODO kerok : add activeSubscription field to User model to keep track of access to features
    // IF active sub, show Stripe portal button and potential upgrade/downgrade button when available
let subscriptions = [ // TODO kerok : replace with dynamic Subscriptions.ts from backend when implemented
  {
    name: 'Basic',
    cost: '$5',
    interval: 'monthly',
    description: 'Basic subscription description'
  },
  {
    name: 'Premium',
    cost: '$10',
    interval: 'monthly',
    description: 'Premium subscription description'
  },
  {
    name: 'Premium',
    cost: '$100',
    interval: 'yearly',
    description: 'Premium subscription description'
  }
]
let lineItems = {
  price_id: 'price_1MATbJHMUUCVzLHGssxvaQOo', // TODO kerok : add price id to separate items when we have more options
  quantity: 1,
  success_url: successURL,
  cancel_url: cancelURL,
  email: account.user.email
}
let subscribe = () => {
  loading.value = true
  axios
    .post('/users/sub', lineItems)
    .catch((error) => {
      console.log(error)
    })
    .then((response) => {
      console.log(response)
      let id = response.data.ID
      console.log(id)
      // need to set up a new page with stripe to redirect to opening a new window/tab and then call this redirect.
      stripe.redirectToCheckout({ sessionId: id })
    })
}
</script>-->
