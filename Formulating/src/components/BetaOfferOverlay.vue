<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(["close"]);
function goToRegister() {
  router.push("/register");
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
  <div
    class="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col mx-auto w-full max-w-3xl border-2 border-slate-400 bg-white rounded-lg shadow-lg z-50"
  >
    <div class="mx-5">
      <p class="text-xl my-10">Access our premium Service!</p>
      <p class="text-gray-600 mb-4">
        Our premium plans offer exclusive features and benefits.
      </p>
      <ul class="list-disc list-inside text-gray-600 mb-4">
        <li>Save and load formulas across devices</li>
        <li>Reuse Ingredients and Formulas</li>
        <li>Store Incis and dynamically sorts your Inci lists</li>
        <li>Categorize and organize Ingredients</li>
        <li>Drag-and-drop Formulating</li>
        <li>Customizable Print page</li>
        <li>Give Feedback and access premium support</li>

      </ul>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 m-5">
      <!-- Monthly Plan -->
      <div class="p-5 border rounded-lg shadow-sm bg-gray-50">
        <h2 class="text-lg font-bold">Monthly Subscription</h2>
        <p class="text-sm text-gray-600 mt-2">Billed monthly at $7.50/month.</p>
        <button
          @click="goToRegister"
          class="mt-4 bg-slate-400 text-white rounded-md px-4 py-2 hover:bg-slate-500 w-full"
        >
          Sign Up
        </button>
      </div>
      <!-- Yearly Plan -->
      <div class="p-5 border rounded-lg shadow-sm bg-gray-50">
        <h2 class="text-lg font-bold">Yearly Subscription</h2>
        <p class="text-sm text-gray-600 mt-2">
          Billed yearly at $75/year (get 2 months free).
        </p>
        <button
          @click="goToRegister"
          class="mt-4 bg-slate-400 text-white rounded-md px-4 py-2 hover:bg-slate-500 w-full"
        >
          Sign Up
        </button>
      </div>
    </div>
    <div class=" m-2 flex justify-end">
      <button
          @click="emit('close')"
          class="mt-4 bg-slate-400 text-white rounded-md px-4 py-2 hover:bg-slate-500 w-full"
      >
        Maybe later
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here if needed */
</style>
