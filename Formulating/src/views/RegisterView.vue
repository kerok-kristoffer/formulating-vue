<template>
  <main class="register bg-cover min-h-screen" :style="{ 'background-image': `url(${imgUrl})` }">
    <div class="md:mx-24 flex flex-col justify-center min-h-screen bg-slate-300 bg-opacity-40">
      <img class="md:mx-14 w-80" src="../assets/mySatchel_text.png" alt="mySatchel" />
      <section class="forms bg-slate-200 p-12 sm:mx-4 md:mx-12 shadow-lg shadow-slate-500">
        <form @submit.prevent="submit">
          <div class="flex flex-col md:w-80">
            <h2 class="font-semibold mx-2">Register</h2>
            <div class="flex flex-col">
              <!-- TODO make input fields w-full on mobile-->
              <input placeholder="User Name" type="text" name="userName" />
              <input placeholder="example@mail.com" type="email" name="email" />
            </div>

            <div class="flex flex-col">
              <input placeholder="Full Name" type="text" name="fullname" />
            </div>

            <div class="flex flex-col">
              <input placeholder="Password" type="password" name="password" />
              <input placeholder="Password Repeat" type="password" name="password_repeat" />
              <input
                class="bg-slate-300 h-8 mt-1 mx-2 px-2 rounded-md hover:cursor-pointer hover:bg-slate-400"
                value="Register"
                type="submit"
              />
            </div>

            <div class="flex flex-row w-full mt-2 bg-slate-200">
              <p class="my-1">Already registered?</p>
              <RouterLink
                class="bg-slate-300 h-8 mx-2 px-2 rounded-md py-1 hover:bg-slate-400"
                to="login"
                >login</RouterLink
              >
            </div>
          </div>
        </form>
      </section>
    </div>

    <div class="">
      <Notification />
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '../stores/account'
import Notification from '../components/Notification.vue'
import imgUrl from '/login_bg.jpg'
import User from '@/types/User'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()

    onMounted(() => {
      const image = new Image()
      image.src = imgUrl
      image.onload = () => {}
    })

    function isAlphaNumeric(str) {
      return /^[a-z0-9]+$/i.test(str)
    }

    const submit = async (e) => {
      const form = new FormData(e.target)
      const inputs = Object.fromEntries(form.entries())
      const account = useAccountStore()

      if (
        inputs.userName.length < 1 ||
        inputs.email.length < 1 ||
        inputs.fullname.length < 1 ||
        inputs.password.length < 1
      ) {
        account.notify('All fields must be filled!', 'error')
        return
      }

      if (inputs.password !== inputs.password_repeat) {
        account.notify('Password repeat does not match password', 'error')
        return
      }

      if (!isAlphaNumeric(inputs.userName)) {
        account.notify('Username can only contain numbers and letters', 'error')
        return
      }

      await axios.post('users', inputs).then(async (response) => {
        if (response.status === 200) {
          console.log(response.data)
          let userData = response.data

          console.log(userData.accessToken)
          console.log(userData.refreshToken)
          let user = new User(
            userData.user.userName,
            userData.user.email,
            userData.user.fullName,
            new Date(userData.user.created_at),
            userData.access_token,
            userData.refresh_token,
            userData.user.StripeCustomerId
          )

          const account = useAccountStore()
          await account.setUser(user)
          await router.push('/formulas')
        }
      })
    }

    return {
      submit,
      imgUrl
    }
  },

  components: { Notification }
}
</script>

<style>
@media (min-width: 1024px) {
  .register {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}
</style>
