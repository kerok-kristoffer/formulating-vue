<template>
  <span v-if="checked === 'checked'" class="bg-green-200 text-green-500 p-2 rounded-xl">✔️</span>
  <span v-else class="bg-red-200 text-red-500 p-2 rounded-xl">✖️</span>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  checked: String
})
</script>