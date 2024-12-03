<template>
  <main
    class="login flex flex-row w-full flex-grow-y min-h-screen bg-cover bg-center"
    id="login-page-container"
    :style="{ 'background-image': `url(${imgUrl})`, 'background-size': 'cover'}"
  >
    <div
      class="mx-0 md:mx-24 flex flex-col bg-slate-300 min-h-screen justify-center
      bg-opacity-40 h-full md:h-4/5 md:w-2/5 w-full"
    >
      <section
        class="forms bg-slate-200 shadow-lg shadow-slate-500 p-5 h-3/5 md:p-8 rounded-b-md md:rounded-md md:mx-12"
      >
        <img @click="goToMain" class="w-full h-auto object-contain hover:cursor-pointer" src="../assets/mySatchel.png" alt="mySatchel" />
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
import router from "@/router";

let account

onMounted(() => {
  const image = new Image()
  image.src = imgUrl
  image.onload = () => {}
  account = useAccountStore()
})

function goToMain() {
  router.push('/')
}

const submit = async (e) => {
  const form = new FormData(e.target)
  const inputs = Object.fromEntries(form.entries())

  // check min length of password
  if (inputs.Password.length < 6) {
    account.notify('Password must be at least 6 characters long', 'error')
    return
  }

  axios.defaults.headers.common['Authorization'] = `Bearer `
  let apiCreds = JSON.parse(import.meta.env.VITE_API_CREDS)

  await account.login(inputs, apiCreds)
}
</script>

<style scoped>

html, body {
  height: 100%;
  margin: 0;
}

#login-page-container {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
}

@media (min-width: 1024px) {
  .login {
    display: flex;
    align-items: center;
  }
}
</style>
