<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg text-center">
      <p class="mb-4">{{ promptText }}</p>
      <button @click="emitYesClick" class="bg-green-500 text-white px-4 py-2 mx-2 rounded">
        Yes
      </button>
      <button @click="emitNoClick" class="bg-red-500 text-white px-4 py-2 mx-2 rounded">No</button>
      <button @click="emitCancelClick" class="bg-gray-500 text-white px-4 py-2 mx-2 rounded">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const { promptText, callback } = defineProps(['promptText', 'callback'])
const emit = defineEmits(['yes-click', 'no-click', 'cancel-click'])

let currentCallback = callback

const emitYesClick = () => emit('yes-click', currentCallback)
const emitNoClick = () => emit('no-click', currentCallback)
const emitCancelClick = () => emit('cancel-click')
</script>

<style scoped>
/* Add any custom styles here */
</style>
