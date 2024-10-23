<template>
  <div class="">
    <button @click="toggleDropdown" class="bg-slate-300 mx-1 px-2 rounded-md border-2 border-slate-400 hover:bg-slate-400 flex items-center">{{ selectedUnit }} <span class="ml-2">▼</span></button>
    <div v-if="isOpen" class="absolute bg-white border rounded shadow-md mt-1 z-50">
      <ul>
        <li v-for="unit in units" :key="unit" @click="selectUnit(unit)" class="px-4 py-2 hover:bg-slate-300 cursor-pointer">
          {{ unit }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import Units from "@/types/Units";
import {userData} from "@/stores/userData";

const units: Units[] = ['g', 'Oz'];
const selectedUnit = ref(userData().settings.preferredUnits);
const isOpen = ref(false);

const emit = defineEmits(['unitSelected']);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectUnit(unit: Units) {
  userData().setPreferredUnit(unit)
  isOpen.value = false;
  emit('unitSelected', unit);
}

watch(() => userData().settings.preferredUnits, (newVal) => {
  selectedUnit.value = newVal;
})
</script>

