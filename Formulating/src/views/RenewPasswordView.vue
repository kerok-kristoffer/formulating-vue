<template>
  <main
      class="renew-password flex flex-col w-full h-full justify-center bg-slate-100"
      id="renew-password-page-container"
  >
    <div
        class="mt-12 mx-0 md:mx-24 flex flex-col pb-72 md:pb-0 bg-opacity-40 h-full md:h-4/5
        md:w-2/5 w-full items-center"
    >
      <section class="forms bg-slate-200 shadow-lg shadow-slate-500 p-5 md:p-8 rounded-b-md md:rounded-md md:mx-12">

        <div v-if="!invalidToken && !validated" class="flex flex-col justify-around">
          <h2 class="font-semibold mx-2">Renew Password</h2>
          <form class="flex flex-col renew-password-form justify-end" @submit.prevent="submit">
            <div class="flex flex-col w-full">
              <input class="w-full" placeholder="New Password" type="password" name="password" v-model="password" />
              <input class="w-full mt-4" placeholder="Confirm Password" type="password" name="confirmPassword" v-model="confirmPassword" />
            </div>

            <div class="w-full flex flex-row justify-end">
              <div class="">
                <input
                    class="flex bg-slate-300 h-8 mx-2 mt-2 px-2 rounded-md hover:cursor-pointer hover:bg-slate-400"
                    value="Renew Password"
                    type="submit"
                />
              </div>
            </div>
          </form>
        </div>


        <div v-if="invalidToken" class="flex justify-center items-center h-full">
          <p>Invalid token</p>
        </div>

        <div v-if="validated" class="">
          <p>Password successfully renewed</p>
          <ButtonStandard :text="'Back to login'" @click="redirect" />
        </div>


      </section>
    </div>

  </main>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import ButtonStandard from "@/components/ButtonStandard.vue";

const password = ref('')
const confirmPassword = ref('')
const token = ref('')
const route = useRoute()
const invalidToken = ref(false)
const validated = ref(false)

onMounted(async() => {
  token.value = route.query.token

  try {
    await axios.post(`users/validate-token`,{ token: token.value })
  } catch (error) {
    invalidToken.value = true
  }
})


const submit = async (e: Event) => {
  e.preventDefault()

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  const token = route.query.token

  axios.post('users/renew-password', { token, new_password: password.value }).then((response) => {
    console.log(response)
    validated.value = true
  }).catch((error) => {
    console.error(error)
  })
}

function redirect() {
  window.location.href = '/login' // TODO potentially get returned User here and automatically redirect to Formulas
}
</script>

<style>

.renew-password {
  min-height: 100vh; /* Ensure the main tag fills the whole screen vertically */
}

@media (min-width: 1024px) {
  .renew-password {
    display: flex;
    align-items: center;
    min-height: 100vh; /* Ensure the main tag fills the whole screen vertically */
  }
}
</style>