<script setup lang="ts">

import FormulatingPanel from "@/components/FormulatingPanel.vue";
import Formula from "@/types/Formula";
import FormulaFactory from "@/types/FormulaFactory";
import {userData} from "@/stores/userData";
import FormulaPrintPage from "@/components/FormulaPrintPage.vue";
import Ingredient from "@/types/Ingredient";
import FormulatingPanelMobile from "@/components/FormulatingPanelMobile.vue";
import UpsellBanner from "@/components/UpsellBanner.vue";

const data = userData()
data.getReactiveDisplayFormula().saveStatus = "free"

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

    <div class="print:hidden banner-header flex items-center justify-center bg-slate-200 shadow-md shadow-slate-300">
      <img
          class="my-4 h-12 w-34"
          src="../assets/mySatchel_text.png"
          alt="mySatchel"
      />
      <h1 class="text-2xl font-bold">Free Calculator</h1>
    </div>


    <FormulatingPanelMobile
        :displayFormula="data.getReactiveDisplayFormula()"
        :freeVersion="true"
        @submitFormula="formulaSubmitted"
        @deleteFormula="deleteFormula"
        @print="print"
        @resetDisplayAndCachedFormula="resetDisplayAndCachedFormula"
        @editIngredient="editIngredient"
    />

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

    <upsell-banner/>

  </div>

</template>

<style scoped>

</style>