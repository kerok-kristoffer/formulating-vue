<template>
  <div
    v-if="showNotice"
    class="fixed inset-0 flex h-full items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="bg-white p-4 rounded shadow-lg">
      <h1 class="text-2xl font-bold mb-2">Welcome to the Beta Version of mySatchel!</h1>
      <div class="mb-2">
        <p>Thank you for exploring our app during this exciting beta phase.</p>
        <p>
          There is a tutorial series started on our Youtube channel
          <a
            href="https://www.youtube.com/playlist?list=PLDxjUdNDZ676dXEKCq6GqGyYI0xJEyxP0"
            class="text-blue-500 underline hover:text-blue-700"
            target="_blank"
          >
            Click here to see
          </a>
        </p>
        <p>
          As we fine-tune our features and functionalities, you may encounter some unexpected
          behavior.
        </p>

        <div v-if="account.getActiveSubscription().name === '7-day trial'">
           <p class="text-lg font-bold my-2">You are currently on the 7-day free trial.</p>
          <p>Your trial period ends on {{ formatDate(account.getActiveSubscription().currentPeriodEnd) }}</p>
        </div>

        <h2 class="text-lg font-bold mt-2 mb-1">What You Should Know:</h2>
        <p>This is a beta version: The app is still under development.</p>
        <p>Expect updates: We're improving and adding new features.</p>
        <p>
          Your experience matters: Please report any issues or provide feedback to help us improve
          the user experience.
        </p>

        <h2 class="text-lg font-bold mt-2 mb-1">What You Can Expect:</h2>
        <p>Swift action on issues: We're committed to quickly addressing any problems.</p>
        <p>Regular improvements: Stay tuned for ongoing enhancements.</p>
        <p class="mt-5">Your participation and feedback are invaluable in shaping mySatchel.</p>
        <p>Thank you for being part of this journey!</p>

        <p class="mt-5">The mySatchel Team</p>
        <p class="mt-5">support@mysatchel.app</p>
      </div>

      <ButtonStandard :text="'Got it!'" @click="closeNotice" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useAccountStore } from '@/stores/account'
import ButtonStandard from '@/components/ButtonStandard.vue'
import { userData } from '@/stores/userData'

let account = useAccountStore()
let showNotice = computed(() => !account.seenVersionNotice)
watch(
  () => account.seenVersionNotice,
  (newVal) => {
    if (newVal) {
      if (userData().debug) {
        console.log('showNotice:', showNotice.value)
      }
    }
  },
  { immediate: true }
)

const closeNotice = () => {
  account.setSeenNotice(true)
  account.keepLoggedIn = true
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-CA')
}
</script>
