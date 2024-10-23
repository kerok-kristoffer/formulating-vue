<template>
  <div
    id="front-page-container"
    class="flex flex-col w-full h-full bg-cover bg-fixed justify-center items-center"
  >
    <div
      class="bg-slate-200 bg-opacity-90 p-4 md:p-8 rounded-lg shadow-lg max-w-full md:max-w-4xl custom-margin-right"
    >
      <img
        class="mb-4 h-16 md:h-24 w-auto mx-auto"
        src="../assets/mySatchel_text.png"
        alt="mySatchel"
      />
      <h1 class="text-xl md:text-2xl font-extrabold text-center mb-4 md:mb-6">
        Formulating Made Simple: Focus on Creation, Not Calculations!
      </h1>
      <p class="text-base md:text-lg mb-2 md:mb-4">
        Are you tired of getting bogged down with spreadsheets, recalculations, and ingredient
        tracking when all you want to do is formulate?
      </p>
      <p class="text-base md:text-lg mb-2 md:mb-4 font-bold">We’ve been there.</p>
      <p class="text-base md:text-lg mb-2 md:mb-4">
        From recalculating costs for every new batch size to managing complex formulations, the
        tedious parts of product formulation often stand in the way of your creativity.
      </p>
      <p class="text-base md:text-lg mb-2 md:mb-4">
        <span class="font-bold">Enter mySatchel.</span> Our online tool takes care of the heavy
        lifting, so you can focus on what you love most—creating.
      </p>
      <ul class="list-disc text-base md:text-lg list-inside mb-2 md:mb-4 space-y-1 md:space-y-2">
        <li>
          <span class="font-bold">Automate calculations</span> like percentages and costs with a few
          clicks—no math or spreadsheets needed.
        </li>
        <li>
          <span class="font-bold">Instant price analysis</span> for your products, no matter the
          batch size.
        </li>
        <li>
          <span class="font-bold">Organize and save formulas & ingredients</span> in one place,
          accessible from anywhere.
        </li>
        <li>
          <span class="font-bold">Built in, clean printable pages</span> so your formulas are
          presentation-ready.
        </li>
        <li>
          <span class="font-bold">Automated INCI list</span> generation saves you time and ensures
          accuracy.
        </li>
        <li>
          <span class="font-bold">Drag-and-drop simplicity</span> with our intuitive interface—no
          tech skills required.
        </li>
      </ul>
      <p class="text-base md:text-lg mb-4 md:mb-6">
        Whether you’re just starting out or you’ve been formulating for years, mySatchel is designed
        to simplify your process. Sign up for a free 7-day trial today and get back to doing what
        you do best—formulating.
      </p>

      <form @submit.prevent="register" class="flex flex-col space-y-2 md:space-y-4">
        <input
          v-model="form.userName"
          type="text"
          class="rounded-md border-2 border-gray-300 p-2"
          placeholder="User Name"
          required
        />
        <input
          v-model="form.fullName"
          type="text"
          class="rounded-md border-2 border-gray-300 p-2"
          placeholder="Full Name"
          required
        />
        <input
          v-model="form.email"
          type="email"
          class="rounded-md border-2 border-gray-300 p-2"
          placeholder="Enter your email address"
          required
        />
        <input
          v-model="form.password"
          type="password"
          class="rounded-md border-2 border-gray-300 p-2"
          placeholder="Password"
          required
        />
        <input
          v-model="form.confirmPassword"
          type="password"
          class="rounded-md border-2 border-gray-300 p-2"
          placeholder="Confirm Password"
          required
        />
        <button type="submit" class="bg-slate-400 text-white rounded-md p-2 hover:bg-slate-500">
          Sign Up for Free 7-Day Trial
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'

const router = useRouter()

const form = ref({
  userName: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const register = async () => {
  const account = useAccountStore()

  const inputs = {
    userName: form.value.userName,
    fullName: form.value.fullName,
    email: form.value.email,
    password: form.value.password,
    password_repeat: form.value.confirmPassword
  }

  function isAlphaNumeric(str) {
    return /^[a-z0-9]+$/i.test(str)
  }

  // TODO implement actual form data handling
  // must match expected format of backend register endpoint
  // check return data and that it is handled correctly in the store,
  if (
    inputs.userName.length < 1 ||
    inputs.fullName.length < 1 ||
    inputs.email.length < 1 ||
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

  if (inputs.password.length < 8) {
    console.log('Password must be at least 8 characters long')
    account.notify('Password must be at least 8 characters long', 'error')
    return
  }

  if (inputs.password !== inputs.password_repeat) {
    alert('Passwords do not match')
    return
  }

  try {
    // TODO add proper register functionality here
    await account.register(inputs)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
#front-page-container {
  background-image: url('../assets/bg_home.png');
  background-size: cover;
  background-position: center;
}

.custom-margin-right {
  margin-right: 0;
}

@media (min-width: 768px) {
  .custom-margin-right {
    margin-right: 30%;
  }
}
</style>
