<template>
  <div class="flex flex-row justify-between mt-0">
    <div class="flex flex-row justify-start">
      <button @click="emitPrint()" class="operation-button">
        <font-awesome-icon icon="print" /> Print
      </button>
    </div>
    <div v-if="displayFormula.saveStatus === 'new'" class="flex flex-row justify-end">
      <button @click="resetDisplayAndCachedFormula" class="operation-button">
        <font-awesome-icon icon="circle-xmark" /> Reset
      </button>
      <button @click="submitFormula" class="operation-button">
        <font-awesome-icon icon="floppy-disk" /> Save
      </button>
      <button @click="toggleShowDetails" class="operation-button">
        <font-awesome-icon icon="gears" /> Details
      </button>
    </div>
    <div v-else class="flex flex-row justify-end">
      <button @click="resetDisplayAndCachedFormula" class="operation-button">
        <font-awesome-icon icon="file-circle-plus" /> New Formula
      </button>
      <button @click="duplicateFormula" class="operation-button">
        <font-awesome-icon icon="copy" /> Duplicate
      </button>
      <button @click="submitUpdateFormula" class="operation-button">
        <font-awesome-icon icon="floppy-disk" /> Save
      </button>
      <button @click="deleteFormula" class="operation-button">
        <font-awesome-icon icon="trash-can" /> Delete

      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  displayFormula: Object,
});

const emit = defineEmits([
  'submitFormula',
  'deleteFormula',
  'resetDisplayAndCachedFormula',
  'toggleShowDetails',
  'submitUpdateFormula',
  'duplicateFormula',
  'print'
]);

const emitPrint = () => emit('print');
const submitFormula = () => emit('submitFormula');
const deleteFormula = () => emit('deleteFormula');
const resetDisplayAndCachedFormula = () => emit('resetDisplayAndCachedFormula');
const submitUpdateFormula = () => {
  emit('submitFormula');
}
const duplicateFormula = () => emit('duplicateFormula');
</script>

<style scoped>
.operation-button {
  background-color: #94a3b8; /* Tailwind CSS slate-400 */
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 0.375rem; /* Tailwind CSS rounded-md */
  font-weight: 600; /* Tailwind CSS font-semibold */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}
.operation-button:hover {
  background-color: #64748b; /* Tailwind CSS slate-300 */
}
</style>