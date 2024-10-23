<template>
  <div v-if="sessionFound" class="flex flex-col items-center justify-center min-h-screen bg-slate-200">
    <div class="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 class="text-2xl font-bold text-green-600 mb-4">Success!</h1>
      <h2 class="text-xl text-gray-700 mb-6">Thank you for your order!</h2>
      <p class="text-lg text-gray-600 mb-6">Your subscription to mySatchel Beta was successful!</p>
      <RouterLink
        class="inline-block bg-slate-400 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow hover:bg-green-600 transition duration-300"
        to="/formulas"
      >
        Start Formulating
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {useRouter} from "vue-router";

const sessionId = ref('')
let sessionFound = ref(false)
onMounted(() => {
  const query = new URLSearchParams(window.location.search)
  if (query.get('session_id')) {
    sessionFound.value = true
    sessionId.value = query.get('session_id')
    console.log(sessionId.value)
    /*let accessToken = Cookies.get('accessToken')
    let refreshToekn = Cookies.get('refreshToken')
    let user = JSON.parse(Cookies.get('user'))
    console.log(accessToken, refreshToekn, user)*/
    // useAccountStore().setUser(user)
    axios.post('/users/sub/confirm', { session_id: sessionId.value }).then((response) => {
      console.log(response.data)
    })
  }
})
</script>
