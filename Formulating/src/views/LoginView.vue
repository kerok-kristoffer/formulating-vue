<template>
  <main
    class="login flex flex-row w-full h-full bg-cover"
    id="login-page-container"
    :style="{ 'background-image': `url(${imgUrl})` }"
  >
    <div
      class="my-auto mx-0 md:mx-24 flex flex-col md:pt-96 pb-72 md:pb-72 bg-slate-300 bg-opacity-40 h-full md:h-4/5 md:w-2/5 w-full"
    >
      <section
        class="forms bg-slate-200 shadow-lg shadow-slate-500 p-5 md:p-8 rounded-b-md md:rounded-md md:mx-12"
      >
        <img class="w-full h-auto object-contain" src="../assets/mySatchel.png" alt="mySatchel" />
        <div class="flex flex-col justify-around">
          <h2 class="font-semibold mx-2">Login</h2>
          <form class="flex flex-col login justify-end" @submit.prevent="submit">
            <div class="flex flex-col md:flex-row w-full">
              <input class="w-1/2" placeholder="Username / Email" type="text" name="userName" />
              <input class="w-1/2" placeholder="Password" type="password" name="Password" />
            </div>

            <div class="w-full flex flex-row justify-end">
              <div class="">
                <input
                  class="flex bg-slate-300 h-8 mx-2 px-2 mt-2 rounded-md hover:cursor-pointer hover:bg-slate-400"
                  value="Login"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="flex flex-col lg:flex-row justify-end mt-2 py-2">
          <p class="my-1 mx-2">Not registered?</p>
          <RouterLink
            class="bg-slate-300 h-8 md:w-44 rounded-md py-1 text-center hover:bg-slate-400"
            to="register"
            >Create an account</RouterLink
          >
        </div>
        <div class="flex flex-col lg:flex-row justify-end">
          <p class="mx-2">Forgot your password?</p>
          <RouterLink
            class="bg-slate-300 h-8 md:w-44 rounded-md py-1 text-center hover:bg-slate-400"
            to="reset-password"
          >
            Reset Password
          </RouterLink>
        </div>
        <PasswordReset />
        <Notification />
      </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import { useAccountStore } from '@/stores/account'
import imgUrl from '/login_bg.jpg'
import Notification from '@/components/Notification.vue'

let account

onMounted(() => {
  const image = new Image()
  image.src = imgUrl
  image.onload = () => {}
  account = useAccountStore()
})

const submit = async (e) => {
  const form = new FormData(e.target)
  const inputs = Object.fromEntries(form.entries())

  axios.defaults.headers.common['Authorization'] = `Bearer `
  let apiCreds = JSON.parse(import.meta.env.VITE_API_CREDS)

  await account.login(inputs, apiCreds)
}
</script>

<style>
@media (min-width: 1024px) {
  .login {
    display: flex;
    align-items: center;
  }
}
</style>
