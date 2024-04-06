<template>
  <div v-if="showNotice" class="fixed inset-0 flex h-full items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded shadow-lg">
      <h1 class="text-xl font-bold mb-2">Welcome to the Beta Version of mySatchel!</h1>
      <div class="mb-2">
        <p>Thank you for exploring our app during this exciting beta phase.</p>
        <p>As we fine-tune our features and functionalities, you may encounter some unexpected behavior.</p>

        <h2 class="text-lg font-bold mt-2 mb-1">What You Should Know:</h2>
        <p>This is a beta version: The app is still under development. </p>
        <p>Expect updates: We're improving and adding new features. </p>
        <p>Your experience matters: Please report any
        issues or provide feedback to help us enhance the app. </p>

        <h2 class="text-lg font-bold mt-2 mb-1">What You Can Expect:</h2>
        <p>Swift action on issues: We're committed to quickly addressing any problems. </p>
        <p>Regular improvements: Stay tuned for ongoing enhancements.</p>
        <p class="mt-5">Your participation and feedback are invaluable in shaping mySatchel. </p>
        <p>Thank you for being part of this journey!</p>
      </div>

      <button @click="closeNotice" class="bg-blue-500 text-white px-4 py-2 rounded">Got it!</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import { useAccountStore } from '@/stores/account'

let account
let closeNotice
let showNotice = ref(true)
onMounted(() => {
  if (Cookies.get('hasSeenNotice')) {
    showNotice.value = false
  }
  account = useAccountStore()
})

closeNotice = () => {
  showNotice.value = false
  account.keepLoggedIn = true
  Cookies.set('hasSeenNotice', true, { expires: 365 })
}
</script>
