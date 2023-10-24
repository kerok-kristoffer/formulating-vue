<template>
  <div class="hidden print:flex w-full justify-around">
    <div class="absolute flex flex-row w-full justify-start">
      <img class="mb-4 h-10 w-24" src="../assets/mySatchel_logo_plain.png" alt="mySatchel" />
    </div>

    <div id="formula-print-box" class="w-full hidden print:flex flex-col mx-0 py-6 rounded-lg">
      <h2 class="font-bold text-lg text-center pb-3">{{ displayFormula.name }}</h2>
      <div class="flex flex-row w-full bg-slate-50 ml-6">
        <div class="flex flex-col w-2/5">
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
            <p class="">{{ displayFormula.created_at }}</p>
          </div>
          <div class="flex flex-row" v-if="displayFormula.updated_at">
            <p class="w-20">updated:</p>
            <p class="">{{ displayFormula.updated_at }}</p>
          </div>
        </div>

        <div class="w-3/5 flex flex-col">{{ displayFormula.description }}</div>
      </div>

      <div class="print:flex flex-col bg-slate-100 mt-4">
        <div class="print:flex flex-col mb-0 px-2 w-full p-0 bg-slate-300">
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
        <ul
          v-for="phase in displayFormula.phases"
          class="print:flex flex-col m-0 px-0 w-full pb-2 pt-2 border-2 border-t-0 border-slate-300"
        >
          <ul
            v-for="ingredient in phase.ingredients"
            class="flex flex-row w-full odd:bg-slate-200 even:bg-slate-300"
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
        </ul>
        <div class="flex flex-col">
          <ul
            v-for="phase in displayFormula.phases"
            class="print:flex flex-col mt-1 mb-0 px-12 w-full pb-3"
          >
            <li v-if="phase.description != ''">
              <div class="flex flex-row px-2">
                {{ phase.name }}
              </div>
              <div class="border-2 bg-white">{{ phase.description }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Formula from "../types/Formula";
import Units from "../types/Units";

const { displayFormula, formulaUnit } = defineProps<{
  displayFormula: Formula,
  formulaUnit: Units
}>();

</script>

<style scoped></style>
