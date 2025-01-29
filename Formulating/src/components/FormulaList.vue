<template>
  <div id="formula-list" class="w-5/6 md:block overflow-y-auto h-3/4 md:h-full max-h-[calc(100vh-4rem)]"> <!-- todo: add filtering on formula tags -->

    <div class="flex flex-row w-full justify-between items-center">
      <h2 class="py-1 bg-slate-300 font-bold w-full rounded-t-md text-center">Formulas
        <div class="flex flex-row pl-2 space-x-1 absolute top-2 left-1" @click.stop>
        <input type="checkbox" v-model="pinned">
        <font-awesome-icon icon="lock" v-if="pinned" />
        <font-awesome-icon icon="lock-open" v-else />
      </div></h2>

    </div>



    <ul class="px-2 py-0 even:bg-slate-100 odd:bg-slate-200 hover:bg-slate-300" v-for="formula in formulas" @click.stop>
      <li class="py-1" v-bind:class="'hover:cursor-pointer status_' + formula.saveStatus" @click="selectFormula(formula)" @click.stop>{{ formula.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import {userData} from "../stores/userData";
import Formula from "../types/Formula";
import {computed, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

let pinned = ref(false);
const emitOptions = defineEmits<{
  clickFormula: [pinned: boolean]
}>()

function selectFormula(formula :Formula) {
  emitOptions('clickFormula', pinned.value, formula);
}

const formulas = computed(() => userData().formulaList.formulas);

</script>