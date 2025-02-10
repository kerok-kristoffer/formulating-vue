<template>
  <div class="hidden print:flex w-full justify-around">
      <div class="">
        <div class="absolute flex flex-row w-full justify-start">
          <img class="mb-4 h-10 w-24 object-contain" src="../assets/mySatchel_text.png" alt="mySatchel" />
        </div>

        <div id="formula-print-box" class="w-full hidden print:flex flex-col mx-0 py-6 rounded-t-lg">
          <h2 class="font-bold text-lg text-center pb-3">{{ displayFormula.name }}</h2>
          <div class="flex flex-row w-full ml-6">
            <div class="flex flex-col w-1/5">
              <div class="flex flex-row">
                <p class="font-bold w-20">amount:</p>
                <p class="font-bold w-20">
                  {{ displayFormula.getWeight(formulaUnit) }}{{ formulaUnit }}
                </p>
              </div>
              <div class="flex flex-row">
                <p class="font-bold w-20">cost:</p>
                <p class="font-semibold" v-if="displayFormula.estimatedCost">
                  ${{ Number(displayFormula.estimatedCost.toFixed(2)) }}
                </p>
              </div>
              <div class="flex flex-row" v-if="displayFormula.created_at">
                <p class="w-20">created:</p>
                <p class="w-20 text-sm">{{ displayFormula.created_at }}</p>
              </div>
              <div class="flex flex-row" v-if="displayFormula.updated_at">
                <p class="w-20">updated:</p>
                <p class="w-20 text-sm">{{ displayFormula.updated_at }}</p>
              </div>
            </div>

            <div v-if="userData().settings.printSettings.showNotes" class="w-4/5 mr-4 flex flex-col">{{ displayFormula.description }}</div>
          </div>

          <div class="print:flex flex-col bg-white mt-4">
            <div class="print:flex flex-col mb-0 px-2 w-full p-0 bg-slate-300 rounded-t-lg">
              <ul class="flex flex-row w-full odd:bg-slate-300 even:bg-slate-200 text-sm">
                <li class="w-12"></li>
                <li class="w-24 font-bold">Phase</li>
                <li class="w-48 font-bold">Ingredient</li>
                <li class="w-24 hidden font-bold">inci</li>
                <li class="w-24 text-end font-bold">percentage</li>
                <li class="w-20 text-end ml-6 font-bold">amount</li>
                <li class="w-24 ml-10 font-bold">cost</li>
              </ul>
            </div>
            <div
                v-for="phase in displayFormula.phases"
                class="print:flex flex-col m-0 px-0 w-full pb-2 pt-2 border-2 border-t-0 border-slate-300 last:bg-slate-800 last:rounded-b-lg"
            >
              <ul
                  v-for="ingredient in getOrderedIngredients(phase).value"
                  class="flex flex-row w-full odd:bg-slate-100 even:bg-white"
              >
                <svg width="20" height="20" class="w-12 pl-2">
                  <rect
                      x="3"
                      y="4"
                      width="15"
                      height="15"
                      style="fill: white; stroke: gray; stroke-width: 2; opacity: 0.8"
                  />
                </svg>
                <li class="w-24">{{ phase.name }}</li>
                <li class="w-48">{{ ingredient.name }}</li>
                <li class="w-24 hidden font-thin italic">{{ ingredient.inci }}</li>
                <li class="w-24 text-end">{{ ingredient.percentage }}%</li>
                <li class="w-20 text-end ml-6" v-if="ingredient.percentage">
                  {{ Number(ingredient.getWeight(formulaUnit)).toFixed(2) }}{{ formulaUnit }}
                </li>
                <li class="w-24 ml-10" v-if="ingredient.percentage">
                  ${{
                    Number((ingredient.getWeight(formulaUnit) * ingredient.cost * 0.001).toFixed(2))
                  }}
                </li>
              </ul>
            </div>
            <div v-if="userData().settings.printSettings.showInstructions" class="flex flex-col">
              <ul
                  v-for="phase in displayFormula.phases"
                  class="print:flex flex-col mt-1 mb-0 px-3 w-full pb-3"
              >
                <li v-if="phase.description!= undefined && phase.description !=''">
                  <div class="flex flex-row px-2">
                    {{ phase.name }}
                  </div>
                  <div class="border-2 rounded-md bg-white p-2">{{ phase.description }}</div>
                </li>
              </ul>
            </div>
            <div v-else class=""></div>
            <div v-if="userData().settings.printSettings.showInciList && sortedInciList.length > 0" class="text-sm font-light">
              <h2 class="font-bold mt-2">Inci</h2>
              <span v-for="(inci, index) in sortedInciList" :key="index">
                {{ inci }}<span v-if="index < sortedInciList.length - 1">, </span>
              </span>
            </div>
          </div>

        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, computed} from 'vue'
import Formula from "../types/Formula";
import Units from "../types/Units";
import Phase from "../types/Phase";
import {userData} from "../stores/userData";

const { displayFormula, formulaUnit } = defineProps<{
  displayFormula: Formula,
  formulaUnit: Units
}>();

const getOrderedIngredients = (phase :Phase) => {
  return computed( () => phase.getOrderedIngredients())
}

const sortedInciList =  computed(() => {
  return displayFormula.getInciList().slice();
})

const waterMarkOptions = ref({
  image: 'mySatchel',
  gap: [20, 20],
  offset: [10, 10],
  zIndex: 5,
  rotate: -20,
})

import('../assets/mySatchel.png').then((module) => {
  waterMarkOptions.value.image = module.default;
});

</script>

<style scoped>
</style>
