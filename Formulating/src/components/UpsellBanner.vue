<script setup lang="ts">

import {useRouter} from "vue-router";
const router = useRouter();
function redirect(path: string) {

  router.push(path);
}

</script>

<template>
  <div class="flex justify-between p-5 border border-gray-300 rounded-none md:rounded-lg bg-gray-100 w-full md:w-3/5 md:content-center md:mx-auto box-border flex-col md:flex-row">
    <div class="flex-1 w-4/5 md:w-full mx-auto md:mx-2 text-center mb-6 md:mb-0">
      <h2 class="text-xl font-bold mb-2">Premium Service</h2>
      <p class="mb-4">Access exclusive features with our premium service. Now offering a 7-day free trial</p>
      <button @click="redirect('/register')" class="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-500">Register</button>
    </div>
    <div class="flex-1 w-4/5 md-w-full mx-auto md:mx-2 text-center">
      <h2 class="text-xl font-bold mb-2">Learn More</h2>
      <p class="mb-4">Discover more about our services and how they can benefit you.</p>
      <button @click="redirect('/about')" class="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-500">Learn More</button>
    </div>
  </div>
</template>

<style scoped>
</style>