<script setup lang="ts">

import FormulatingPanel from "@/components/FormulatingPanel.vue";
import Formula from "@/types/Formula";
import FormulaFactory from "@/types/FormulaFactory";
import {userData} from "@/stores/userData";
import FormulaPrintPage from "@/components/FormulaPrintPage.vue";
import Ingredient from "@/types/Ingredient";
import FormulatingPanelMobile from "@/components/FormulatingPanelMobile.vue";
import UpsellBanner from "@/components/UpsellBanner.vue";
import {watch, ref} from "vue";
import {useRouter} from "vue-router";
import BetaOfferOverlay from "@/components/BetaOfferOverlay.vue";

const router = useRouter()

const data = userData()
data.getReactiveDisplayFormula().saveStatus = "free"

watch(
    () => userData().displayFormula,
    (newFormula) => {
      userData().setDirtyCachedFormula(newFormula);
    },
    { deep: true }
);

const showBetaOfferOverlay = ref(false)

function toggleBetaOfferOverlay() {
  showBetaOfferOverlay.value = !showBetaOfferOverlay.value
}

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

function goToLogin() {
  router.push('/login')
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
        @displayStripeOverlay="toggleBetaOfferOverlay"
        @editIngredient="editIngredient"
    />
    <formula-print-page :display-formula="userData().displayFormula" :formula-unit="data.settings.preferredUnits" />

    <upsell-banner/>

    <beta-offer-overlay
        v-if="showBetaOfferOverlay"
        @close="toggleBetaOfferOverlay"
    />

    <!-- Floating div for already signed up notice -->
    <div
        class="hidden md:block fixed bottom-4 right-4 bg-slate-200 bg-opacity-90 p-4 rounded-lg shadow-lg"
    >
      <p class="text-center mb-2">Already signed up?</p>
      <button
          @click="goToLogin"
          class="bg-slate-400 text-white rounded-md p-2 hover:bg-slate-500 w-full"
      >
        Login
      </button>
    </div>

  </div>

</template>

<style scoped>

</style>