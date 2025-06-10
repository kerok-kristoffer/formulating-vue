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
import Ingredient from "@/types/Ingredient";
import FormulaFactory from "@/types/FormulaFactory";
import {selectNextInputOnEnterClick} from "@/types/UIHelper";
import IngredientBuilder from "@/types/IngredientBuilder";

const { displayFormula, freeVersion } = defineProps<{
  displayFormula: Formula,
  freeVersion: boolean
}>();
let data = userData()
const formulaUnit = computed(() => data.settings.preferredUnits)

const emit = defineEmits([
  'submitFormula',
  'deleteFormula',
  'resetDisplayAndCachedFormula',
  'editIngredient'
])

const getDynamicCost = (ingredient: Ingredient) => computed({
  get() {
    // Format the cost dynamically based on the formulaUnit
    return ingredient.getCost(formulaUnit.value)
  },
  set(value: number) {
    // Update the cost dynamically based on the formulaUnit
    ingredient.setCost(value, formulaUnit.value)
  }
});

function selectText(event) {
  event.target.select()
}

const ingredientInputs = ref({});

const submitFormula = async () => {
  await FormulaHelper.submitFormula(data.displayFormula)
}

const resetDisplayAndCachedFormula = () => {
  emit('resetDisplayAndCachedFormula')
}

const deleteFormula = () => {
  emit('deleteFormula')
}

const duplicateFormula = () => {
  let duplicate = FormulaHelper.duplicateFormula(data.displayFormula)
  useAccountStore().notify(duplicate.name + " duplicated", "success")
}

const getOrderedIngredients = (phase :Phase) => {
  return computed( () => phase.getOrderedIngredients())
}

function updateIngredientPercentage(ing, value) {
  ing.percentage = FormulaHelper.formatDecimal(value)
  FormulaHelper.updateIngredientWeight(displayFormula, data.settings.preferredUnits, ing)
}


async function addNewIngredientFromSearch(phase :Phase, name :string) {
  let newIngredient = new IngredientBuilder().setName(name).build()

  if (!freeVersion) {
    await data.api.getIngredientService().createIngredient(newIngredient).then((ing) => {

      newIngredient = FormulaFactory.createIngredientFromAPIData(ing, data.ingredientList.ingredients.length)
      data.ingredientList.ingredients.push(newIngredient)
      data.ingredientList.ingredients.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 });
    })
  }
  addExistingIngredientFromSearch(phase, newIngredient)
}

function addExistingIngredientFromSearch(phase :Phase, ingredient :Ingredient) {
  ingredient.percentage = 0
  phase.addIngredient(ingredient)
  phase.updateIngredientOrderByPercentageAndName()
  phase.searchIngredient = ""
}

function showStripeOverlay() {
  console.log('showStripeOverlay')
  useAccountStore().notify("Subscribe for premium features", "error")
}

function deleteFormulaIngredient(phase, ingKey) {
  phase.removeIngredientByIndex(ingKey)
  displayFormula.updateWeights(data.settings.preferredUnits)
  displayFormula.updateCost(data.settings.preferredUnits)
}

</script>

<template>
  <div id="mobile-formulating-panel" class="md:hidden print:hidden w-full bg-slate-100 pt-3 mb-14">
    <font-awesome-icon v-if="!freeVersion" @click="data.toggleFormulaListPanel()" :icon="['fa', 'file-lines']" class=" ml-1 text-slate-400 text-3xl" />
    <div class="flex flex-wrap w-full text-xl text-center">
      <!-- add displayFormula.name input  -->
      <input type="text" placeholder="New Formula" class="h-6 flex-grow bg-transparent border-0" name="formula-name" id="formula-name" v-model.lazy="displayFormula.name">
      <span class="inline-flex w-full mt-2 md:mt-0">
          <label for="totalWeight" class="text-lg w-1/5">Amount:</label>
          <input v-if="formulaUnit==='g'" type="number" v-model="displayFormula.totalWeight" v-on:blur="FormulaHelper.weightUpdate(displayFormula, formulaUnit)" class="mt-1 h-6 w-2/5 text-right bg-transparent border-0">
          <input v-else-if="formulaUnit==='Oz'" type="number" v-model="displayFormula.totalWeightInOunces" v-on:blur="FormulaHelper.weightUpdate(displayFormula, formulaUnit)" class="mt-1 h-6 w-2/5 text-right bg-transparent border-0">
          <UnitSelector class="h-6 mb-2 text-md w-2/5 justify-end" @unitSelected="data.setPreferredUnit(formulaUnit)" />
      </span>
    </div>

    <ul v-for="(phase, phaseKey) in displayFormula.phases" class="flex flex-col odd:bg-slate-300 text-xs">
      <li class="w-full flex flex-col mb-2" :key="phaseKey" :id="'phase-' + phaseKey">
        <div class="flex flex-row justify-between mb-0.5 pt-0.5">
          <input :id="'mobile-phase-name-' + phaseKey" v-model="phase.name" :placeholder="'Phase-' + (phaseKey + 1)" class="ml-1 text-lg bg-transparent border-hidden  border-2 border-slate-300 rounded-md"/>
          <font-awesome-icon @click="FormulaHelper.removePhase(displayFormula, phaseKey)" :icon="['fa', 'circle-xmark']" class="mx-1 text-slate-400 text-xl" />
        </div>
        <ul v-for="(ing, ingKey) in getOrderedIngredients(phase).value" class="flex flex-col ml-2">
          <li class="flex flex-row my-0.5">
            <div class="w-3/12 sm:w-4/12">
              {{ ing.name }}
            </div>
            <div class="w-2/12 inline-flex">
              <input type="number" :value="ing.percentage"
                     :id="'ingredient-mob-input-' + phaseKey + '-' + ingKey"
                     :ref="'ingredientMobInput-' + phaseKey + '-' + ingKey"
                     @focus="selectText"
                     @blur="updateIngredientPercentage(ing, $event.target.value)"
                     @keydown.enter="selectNextInputOnEnterClick($event, ingKey, phaseKey, ingredientInputs, 'ingredient-mob-input')"
                     class="text-xs text-right border-0 h-4 w-3/4 p-0.5 bg-transparent"/>%
            </div>
            <div class="w-2/12 text-right">
              <div v-if="ing.percentage" class="">{{ Number(ing.getWeight(formulaUnit)).toFixed(2) }}{{ formulaUnit }}</div>
            </div>
            <div class="w-3/12 inline-flex text-right">
              <input
                  type="number"
                  v-model.lazy="getDynamicCost(ing).value"
                  :id="'ingredient-mob-cost-' + phaseKey + '-' + ingKey"
                  class="text-xs text-right border-0 h-4 w-3/4 p-0.5 bg-transparent"
                  @focus="selectText"
                  @keydown.up.prevent
                  @keydown.down.prevent
                  @keydown.enter="selectNextInputOnEnterClick($event, ingKey, phaseKey, ingredientInputs, 'ingredient-mob-cost')"
                  @blur="displayFormula.updateCost()"
              >
              <div class=""  v-show="formulaUnit==='g'" >/kg</div>
              <div class=""  v-show="formulaUnit==='Oz'">/Oz</div>
            </div>
            <div class="w-2/12 text-right pr-1">
              <div  v-if="ing.percentage">${{Number((ing.getWeight('g') * ing.cost * 0.001 ).toFixed(2)) }}</div>
            </div>
            <font-awesome-icon @click="deleteFormulaIngredient(phase, ingKey)" :icon="['fa', 'circle-xmark']" class="mx-1 text-slate-400 text-md" />
          </li>

        </ul>
        <search-ingredient-box :phase="phase" :phase-key="phaseKey"
                               :ingredients="data.ingredientList.ingredients"
                               :mobile="true"
                               @addNewSearchIngredient="addNewIngredientFromSearch"
                               @addExistingIngredient="addExistingIngredientFromSearch"
                               class="w-full"
        />
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
      <div v-if="!freeVersion" class="flex flex-row gap-5 justify-end w-full text-lg">
        <!--          <ButtonDanger :text="'Delete'" @click="deleteFormula" class="w-full"/>-->
        <!--          <ButtonStandard :text="'Save'" @click="submitFormula" class="w-full"/>-->
        <font-awesome-icon @click="submitFormula" :icon="['fas', 'floppy-disk']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <!--          <ButtonStandard :text="'New'" @click="resetDisplayAndCachedFormula" class="w-full"/>-->
        <font-awesome-icon @click="resetDisplayAndCachedFormula" :icon="['fas', 'file-circle-plus']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon @click="duplicateFormula" :icon="['fas', 'copy']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon v-if="displayFormula.saveStatus === 'new'" v-tooltip="'Reset formula'" @click="resetDisplayAndCachedFormula" :icon="['fas', 'trash-can']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon v-else @click="deleteFormula" :icon="['fas', 'trash-can']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
      </div>
      <div v-else class="flex flex-row gap-5 justify-end w-full text-lg">
<!--  todo: implement below buttons adapted for free version -->
        <font-awesome-icon @click="showStripeOverlay" :icon="['fas', 'floppy-disk']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <!--          <ButtonStandard :text="'New'" @click="resetDisplayAndCachedFormula" class="w-full"/>-->
        <font-awesome-icon @click="showStripeOverlay" :icon="['fas', 'copy']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
        <font-awesome-icon @click="resetDisplayAndCachedFormula" :icon="['fas', 'trash-can']" class="top-1/2 mx-1 flex text-slate-400 text-3xl hover:cursor-pointer" />
      </div>
    </div>



  </div>
</template>

<style scoped>

</style>