<template>
  <div class="fixed top-0 left-0 flex flex-row items-center justify-center"></div>
  <button
    @click="clickAction"
    class="px-1 h-8 md:h-6 border rounded-md border-solid max-w-fit bg-slate-400 hover:bg-slate-300 border-slate-500 text-xl md:text-sm"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const { text } = defineProps(['text'])
const emit = defineEmits(['click'])
function clickAction() {
  emit('click', 'hello from component!')
}
</script>

<style scoped></style>
