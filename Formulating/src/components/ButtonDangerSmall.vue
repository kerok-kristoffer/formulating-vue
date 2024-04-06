<template>
  <div class="fixed top-0 left-0 flex flex-row items-center justify-center"></div>
  <button
    @click="clickAction"
    class="px-1 h-4 w-4 md:h-6 border rounded-md border-solid max-w-fit bg-red-300 hover:bg-slate-300 border-red-500 text-md md:text-sm"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const { text } = defineProps(['text'])
const emit = defineEmits(['click'])
function clickAction() {
  emit('click')
}
</script>

<style scoped></style>
