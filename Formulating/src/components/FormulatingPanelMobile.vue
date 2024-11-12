<script setup lang="ts">

import SearchIngredientBox from "@/components/SearchIngredientBox.vue";
import UnitSelector from "@/components/UnitSelector.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import {computed, defineProps, ref} from "vue";
import {userData} from "@/stores/userData";
import Formula from "@/types/Formula";
import FormulaHelper from "@/types/FormulaHelper";
import {useAccountStore} from "@/stores/account";
import Phase from "@/types/Phase";

const { displayFormula } = defineProps<{
  displayFormula: Formula,
}>();
let data = userData()
const formulaUnit = computed(() => data.settings.preferredUnits)

const emit = defineEmits([
  'submitFormula',
  'deleteFormula',
  'resetDisplayAndCachedFormula',
  'editIngredient'
])

const submitFormula = async () => {
  console.log("submitting formula" + data.displayFormula.name + " id: " + data.displayFormula.id)

  await FormulaHelper.submitFormula(data.displayFormula)
  console.log("submitted formula, updating cached formula")
  data.setCachedFormula(data.displayFormula)
}

const resetDisplayAndCachedFormula = () => {
  emit('resetDisplayAndCachedFormula')
}

const deleteFormula = () => {
  emit('deleteFormula')
}

const duplicateFormula = () => {
  let duplicate = FormulaHelper.duplicateFormula(data.displayFormula)
  console.log("duplicated formula: ", duplicate.name)
  useAccountStore().notify(data.displayFormula.name + " duplicated", "success")
}

const getOrderedIngredients = (phase :Phase) => {
  return computed( () => phase.getOrderedIngredients())
}

function updateIngredientPercentage(ing, value) {
  ing.percentage = FormulaHelper.formatDecimal(value)
  FormulaHelper.updateIngredientWeight(displayFormula, data.settings.preferredUnits, ing)
}

</script>

<template>
  <div id="mobile-formulating-panel" class="md:hidden print:hidden w-full bg-slate-100 pt-3 mb-14">
    <font-awesome-icon @click="data.toggleFormulaListPanel()" :icon="['fa', 'file-lines']" class=" ml-1 text-slate-400 text-3xl" />
    <div class="flex flex-wrap w-full text-xl text-center">
      <!-- add displayFormula.name input  -->
      <input type="text" placeholder="New Formula" class="h-6 flex-grow bg-transparent border-0" name="formula-name" id="formula-name" v-model.lazy="displayFormula.name">
      <span class="inline-flex w-full md:w-auto justify-start mt-2 md:mt-0">
          <input v-if="formulaUnit==='g'" type="number" v-model="displayFormula.totalWeight" v-on:blur="FormulaHelper.weightUpdate(displayFormula, formulaUnit)" class="h-6 text-right bg-transparent border-0">
          <input v-else-if="formulaUnit==='Oz'" type="number" v-model="displayFormula.totalWeightInOunces" v-on:blur="FormulaHelper.weightUpdate(displayFormula, formulaUnit)" class="h-6 text-right bg-transparent border-0">
          <UnitSelector class="w-1/5 h-6 mb-2 text-md" @unitSelected="data.setPreferredUnit(formulaUnit)" />
      </span>
    </div>

    <ul v-for="(phase, phaseKey) in displayFormula.phases" class="flex flex-col odd:bg-slate-300 text-xs">
      <li class="w-full flex flex-col mb-2" :key="phaseKey" :id="'phase-' + phaseKey">
        <div class="flex flex-row justify-between mb-0.5 pt-0.5">
          <input :id="'mobile-phase-name-' + phaseKey" v-model="phase.name" class="text-lg bg-transparent"/>
          <font-awesome-icon @click="FormulaHelper.removePhase(displayFormula, phaseKey)" :icon="['fa', 'circle-xmark']" class="mx-1 text-slate-400 text-xl" />
        </div>
        <ul v-for="(ing, ingKey) in getOrderedIngredients(phase).value" class="flex flex-col ml-2">
          <li class="flex flex-row my-0.5">
            <div class="w-4/12">
              {{ ing.name }}
            </div>
            <div class="w-2/12 inline-flex">
              <input type="number" :value="ing.percentage" @blur="updateIngredientPercentage(ing, $event.target.value)" class="text-xs text-right border-0 h-4 w-3/4 p-0.5 bg-transparent"/>%
            </div>
            <div v-if="ing.percentage" class="w-2/12 text-right"> <div class="">{{ Number(ing.getWeight(formulaUnit)).toFixed(2) }}{{ formulaUnit }}</div>   </div>
            <div class="w-2/12 inline-flex text-right">
              <div class="w-full w-full text-right" v-show="formulaUnit==='g'" > ${{ Number(ing.getCost(formulaUnit)).toFixed(2) }}/kg</div>
              <div class="w-full w-full text-right" v-show="formulaUnit==='Oz'"> ${{ Number(ing.getCost(formulaUnit)).toFixed(2) }}/Oz</div>
            </div>
            <div class="w-2/12 text-right pr-1" v-if="displayFormula.estimatedCost">${{Number((ing.getWeight('g') * ing.cost * 0.001 ).toFixed(2)) }}</div>
            <font-awesome-icon @click="phase.removeIngredientByIndex(ingKey)" :icon="['fa', 'circle-xmark']" class="mx-1 text-slate-400 text-md" />
          </li>

        </ul>
        <search-ingredient-box :phase="phase" :phase-key="phase" />
      </li>
    </ul>
    <div class="flex flex-row justify-end w-full text-lg">
      <div class="w-6/12"></div>
      <div class="w-4/12">remaining: {{displayFormula.getAllocatedPercentagesRemaining()}}%</div>
      <div class="mr-10" v-if="displayFormula.estimatedCost">${{Number(displayFormula.estimatedCost).toFixed(2)}}</div>
    </div>
    <div class="flex flex-between flex-row w-full mt-1 px-1 items-center py-3 bg-slate-300">
      <div class="flex flex-row gap-2 justify-start w-full text-lg">
        <!--          <ButtonStandard :text="'Add Phase'" @click="addPhase" class="w-full"/>-->
        <font-awesome-icon @click="FormulaHelper.addPhase(displayFormula)" :icon="['fas', 'plus']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
      </div>
      <div class="flex flex-row gap-5 justify-end w-full text-lg">
        <!--          <ButtonDanger :text="'Delete'" @click="deleteFormula" class="w-full"/>-->
        <!--          <ButtonStandard :text="'Save'" @click="submitFormula" class="w-full"/>-->
        <font-awesome-icon @click="submitFormula" :icon="['fas', 'floppy-disk']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <!--          <ButtonStandard :text="'New'" @click="resetDisplayAndCachedFormula" class="w-full"/>-->
        <font-awesome-icon @click="resetDisplayAndCachedFormula" :icon="['fas', 'file-circle-plus']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon @click="duplicateFormula" :icon="['fas', 'copy']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon v-if="displayFormula.saveStatus === 'new'" v-tooltip="'Reset formula'" @click="resetDisplayAndCachedFormula" :icon="['fas', 'trash-can']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon v-else @click="deleteFormula" :icon="['fas', 'trash-can']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
      </div>
    </div>



  </div>
</template>

<style scoped>

</style>