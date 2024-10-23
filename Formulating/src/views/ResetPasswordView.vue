<template>
  <main
      class="reset-password flex flex-col justify-end items-end w-full h-full"
      id="reset-password-page-container"
  >
    <div
        class="mt-72 h-full md:my-auto mx-0 md:mx-24 flex flex-col md:pt-96 pb-72 md:pb-72 md:h-4/5 md:w-2/5 w-full"
    >
      <section v-if="!success" class="forms shadow-lg shadow-slate-500 p-5 md:p-8 rounded-b-md md:rounded-md md:mx-12">
        <div class="flex flex-col justify-around">
          <h2 class="font-semibold mx-2">Reset Password</h2>
          <form class="flex flex-col reset-password justify-end" @submit.prevent="submit">
            <div class="flex flex-col w-full">
              <input class="w-full" placeholder="Email" type="email" name="email" v-model="email" />
            </div>

            <div class="w-full flex flex-row justify-end">
              <div class="">
                <input
                    class="flex bg-slate-300 h-8 mt-2 mx-2 px-2 rounded-md hover:cursor-pointer hover:bg-slate-400"
                    value="Reset Password"
                    type="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
      <div v-else class="mx-0 md:mx-24 flex flex-col
      bg-slate-200 h-full md:h-4/5 md:w-3/5 p-5 shadow-lg shadow-slate-500 md:rounded-md w-full">
        <p>Reset link sent to {{ email }}</p>
         <p>If we found an eligible account associated, we've sent password reset instructions to the primary email address on the account.
           Check your spam folder if you don't see it. This could take up to 30 minutes.</p>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAccountStore } from '@/stores/account'

const email = ref('')
const account = useAccountStore()
const success = ref(false)

const submit = async (e: Event) => {
  e.preventDefault()

  axios.defaults.headers.common['Authorization'] = `Bearer `
  axios.post('reset-password', { email: email.value }).then((response) => {
    console.log(response)
    // TODO: Handle the response
    success.value = true
  }).catch((error) => {
    account.notify("email not found", "error");
  })
}
</script>

<style>
@media (min-width: 1024px) {
  .reset-password {
    display: flex;
    align-items: center;
  }
}
</style>