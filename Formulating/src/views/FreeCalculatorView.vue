<script setup lang="ts">

import FormulatingPanel from "@/components/FormulatingPanel.vue";
import {onMounted} from "vue";
import Formula from "@/types/Formula";
import FormulaFactory from "@/types/FormulaFactory";
import {userData} from "@/stores/userData";
import FormulaPrintPage from "@/components/FormulaPrintPage.vue";
import Ingredient from "@/types/Ingredient";

let displayFormula = FormulaFactory.createDefaultFormula()

const data = userData()
data.getReactiveDisplayFormula().saveStatus = "free"
/*
* displayFormula should be saved in local storage as normal, so that when the user comes back to the page, the formula is still there,
* and if they register, they can simply save their formula to the backend.
*  One thing to keep in mind though, is that the Ingredients need to be saved before the formula, so that the formula can reference the ingredients.
*
*
* */

function formulaSubmitted(formula: string) {

}
function deleteFormula() {

}
function print() {
  window.print()
}
function resetDisplayAndCachedFormula() {
  let resetFormula = FormulaFactory.createDefaultFormula()
  data.setDisplayFormula(resetFormula, "free - reset")
  data.setCachedFormula(resetFormula)
  data.getReactiveDisplayFormula().saveStatus = 'free'
}
function editIngredient() {
}

const onDrop = (event) => {
  event.stopPropagation();
  const ingredientId = event.dataTransfer.getData('ingredientPhaseIndex')
  const phaseKey = event.dataTransfer.getData('phaseKey')
  const phase = data.getReactiveDisplayFormula().phases[phaseKey]
  if (phase !== undefined) {
    const ingredients :Ingredient[] = phase.ingredients
    ingredients.splice(ingredientId, 1)
    weightUpdate(data.getReactiveDisplayFormula())
  } else {
  }
}
const weightUpdate = (formula :Formula) :void => {
  formula.updateWeights(data.settings.preferredUnits)
  formula.updateCost(data.settings.preferredUnits)
}

</script>

<template>
  <div class="drop-zone h-full"
       @drop="onDrop($event)"
       @dragenter.prevent
       @dragover.prevent>
    <FormulatingPanel
        :displayFormula="data.getReactiveDisplayFormula()"
        :freeVersion="true"
        @submitFormula="formulaSubmitted"
        @deleteFormula="deleteFormula"
        @print="print"
        @resetDisplayAndCachedFormula="resetDisplayAndCachedFormula"
        @editIngredient="editIngredient"
    />
    <formula-print-page :display-formula="userData().displayFormula" :formula-unit="data.settings.preferredUnits" />
  </div>

</template>

<style scoped>

</style>