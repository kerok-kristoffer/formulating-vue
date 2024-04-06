<template>
  <div class="flex flex-col w-1/2 mx-auto">
    <div class="flex flex-row h-96"></div>
    <div class="profile bg-slate-200 p-3 rounded-md">
      <h1 class="text-lg font-bold">Success</h1>
      <h2>Thanks for your order!</h2>
      <p>Subscription to mySatchel Beta successful!</p>
      <p>
        Start formulating
        <RouterLink class="bg-slate-300 hover:bg-slate-400 px-1 h-8 rounded-md py-1" to="formulas"
          >Go!</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useAccountStore} from "@/stores/account";
import SubPlan from "@/types/SubPlan";
import axios from "axios";

const sessionId = ref('')

onMounted(() => {
  const query = new URLSearchParams(window.location.search)
  if (query.get('session_id')) {
    sessionId.value = query.get('session_id')
    console.log(sessionId.value);
    useAccountStore().setActiveSubscription(SubPlan.getDummySubPlans()[2]); // TODO this currently saves subscription to store, but does not save to back-end
// TODO perhaps test this out using Postman before implementing front end.
    // TODO we should expect backend to validate the session id and save the subscription to the user
    // TODO then it should return the user with the updated subscription and redirect to the formula page
    // TODO I still need to keep track of the user's subscription in the store, it should update when the user logs in or refreshes the session
    axios.post('/users/sub/confirm', { session_id: sessionId.value }).then((response) => {
      console.log(response.data)
    })
  }
})
</script>
