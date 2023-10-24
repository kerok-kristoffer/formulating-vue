<template>
  <main>
    <div class="flex flex-col m-3 justify-center">
      <div class="flex w-1/2 m-auto">
        <h2 class="text-lg font-bold">Choose a subscription plan!</h2>
      </div>
      <div class="flex flex-row justify-around">
        <div class="flex flex-col w-1/2 m-auto border-2">
          <div class="flex flex-col">
            <h3>Beta Test</h3>
            <h5>$50.00 / year</h5>
          </div>
          <button @click="subscribe" class="bg-slate-200 border-2 border-slate-500">I'm in!</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onBeforeMount } from 'vue'
import { useAccountStore } from '../stores/account'

const loading = ref(false)

let stripe = Stripe(
  'pk_test_51MAT5eHMUUCVzLHGkctuDt3QuEfYgWR82qK8RwRcjaPSU93Dz4MtutgQRtSbGGbhQJpUNCSz4Gxl61frkTcmPh1h008OSU71Al'
)

let account = useAccountStore() // kerok: add Stripe portal button, should be visible for users with an active sub. Get link from backend?

let successURL = 'https://mysatchel-e2f78.web.app/success'
let cancelURL = 'https://mysatchel-e2f78.web.app/cancel'
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
</script>
