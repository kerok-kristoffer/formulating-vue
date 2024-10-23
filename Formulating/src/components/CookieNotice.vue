<template>
  <div
    v-if="showNotice"
    class="fixed bottom-0 left-0 right-0 mb-0 bg-slate-100 border-t-2 border-slate-300 p-2 shadow-lg flex justify-between items-center z-50"
  >
    <p class="text-sm px-2">
      mySatchel.app uses cookies to ensure the proper functionality of our website. No external
      tracking or advertising cookies are used.
    </p>
    <button @click="closeNotice" class="bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded ml-4">
      Got it!
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const showNotice = ref(true)

const closeNotice = () => {
  showNotice.value = false
  Cookies.set('cookiesAccepted', true, { expires: 365 })
}

onMounted(() => {
  if (Cookies.get('cookiesAccepted')) {
    showNotice.value = false
  }
})
</script>
