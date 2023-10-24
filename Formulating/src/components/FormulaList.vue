<template>
  <div id="formula-list" class="w-1/6 px-2 hidden md:block"> <!-- todo: add filtering on formula tags -->
    <h2 class="py-1 bg-slate-300 font-bold rounded-t-md text-center">Formulas</h2>

    <ul class="px-2 py-1 even:bg-slate-100 odd:bg-slate-200 hover:bg-slate-300" v-for="formula in formulas">
      <li v-bind:class="'hover:cursor-pointer status_' + formula.saveStatus" @click="selectFormula(formula)">{{ formula.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import {userData} from "../stores/userData";
import Formula from "../types/Formula";

const emitOptions = defineEmits<{
  clickFormula: [formula: Formula]
  // (e: 'clickFormula', formula: Formula): void
}>()

function selectFormula(formula :Formula) {
  emitOptions('clickFormula', formula);
}

const formulas :Formula[] = userData().formulaList.formulas;

</script>

<style scoped>

</style>