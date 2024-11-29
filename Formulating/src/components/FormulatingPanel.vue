<script setup lang="ts">
import SearchIngredientBox from '@/components/SearchIngredientBox.vue'
import FormulaOperations from '@/components/FormulaOperations.vue'
import UnitSelector from '@/components/UnitSelector.vue'
import FormulaDetails from '@/components/FormulaDetails.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { userData } from '@/stores/userData'
import {computed, defineProps, nextTick, onMounted, ref, watch} from 'vue'
import Formula from '@/types/Formula'
import FormulaHelper from "@/types/FormulaHelper";
import {useAccountStore} from "@/stores/account";
import Phase from "@/types/Phase";
import Ingredient from "@/types/Ingredient";
import FormulaFactory from "@/types/FormulaFactory";

const data = userData()
const { displayFormula } = defineProps<{
  displayFormula: Formula,
}>();

onMounted(() => {
  updateIngredientInputs()
})
const formulaUnit = computed(() => data.settings.preferredUnits)

const emit = defineEmits([
  'submitFormula',
  'deleteFormula',
  'print',
  'resetDisplayAndCachedFormula',
    'editIngredient'
])

function editIngredient(ingredient :Ingredient) {
  emit('editIngredient', ingredient)
}

const submitFormula = async () => {
  await FormulaHelper.submitFormula(data.getReactiveDisplayFormula())
  data.setCachedFormula(data.getReactiveDisplayFormula())
}

const showPhaseDescs = ref(new Set())

const toggleDescShow = (index :number) => {
  if (showPhaseDescs.value.has(index)) {
    showPhaseDescs.value.delete(index)
  } else {
    showPhaseDescs.value.add(index)
  }
}
let showDetails = ref(false);
function toggleShowDetails() {
  showDetails.value = !showDetails.value;
}

const deleteFormula = () => {

  emit('deleteFormula')
}

const print = () => {
  emit('print')
}

const resetDisplayAndCachedFormula = () => {
  emit('resetDisplayAndCachedFormula')
}

function attemptDuplicateFormula() {
  data.attemptSetDisplayFormula(data.getReactiveDisplayFormula())
  console.log("dirty check completed")
  // duplicateFormula()
}

const duplicateFormula = () => {

  let duplicate = FormulaHelper.duplicateFormula(data.displayFormula)
  console.log("duplicated formula: ", duplicate.name)
  useAccountStore().notify(data.displayFormula.name + " duplicated", "success")
}

const onDropFormula = (event, dropPhase :Phase) => {
  // todo: possible to transfer Ingredient object instead of strings?
  let ingredientListIndex = event.dataTransfer.getData('ingredientListIndex')
  let ingredientIndex = event.dataTransfer.getData('ingredientPhaseIndex')

  const fromPhaseKey = event.dataTransfer.getData('phaseKey')
  if (fromPhaseKey) {
    data.getReactiveDisplayFormula().moveIngredientFromPhaseToPhase(ingredientIndex, fromPhaseKey, dropPhase)
    data.setDragIngredient(null)
    // ingredientDropFromPhase(fromPhaseKey, dropPhase)
  } else {
    ingredientDropFromIngredientList(ingredientListIndex, dropPhase)
  } // TODO move this drag-drop logic to a helper class
}

const startDragFormula = (event, phaseKey: number, ingredientIndex: number | string) => {
  event.dataTransfer.dropEffect = 'copy'
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('phaseKey', phaseKey)
  event.dataTransfer.setData('ingredientPhaseIndex', ingredientIndex)
  const ingredient = data.getReactiveDisplayFormula().phases[phaseKey].ingredients[ingredientIndex]
  data.setDragIngredient(ingredient)
}

const ingredientDropFromIngredientList = (ingredientListIndex :number, dropPhase :Phase) => {

  let ingredient = data.ingredientList.ingredients.find((i) => i.id == ingredientListIndex)

  if(ingredient != undefined) {
    dropPhase.addIngredient(new Ingredient(0, ingredient.ingredient_id, ingredient.name, ingredient.inci, 0, Number(ingredient.cost), []))
    dropPhase.updateIngredientOrderByPercentageAndName()
    return
  }
}

const getOrderedIngredients = (phase :Phase) => {
  return computed( () => phase.getOrderedIngredients())
}

const ingredientInputs = ref({});

const updateIngredientInputs = async () => {
  await nextTick()
  const inputs = document.querySelectorAll('[id^="ingredient-input-"]');
  inputs.forEach((input, index) => {
    const id = input.id;
    ingredientInputs.value[id] = input;
  });
};

// Watch for changes in the ingredient list
watch(() => displayFormula.phases, updateIngredientInputs, { deep: true });

async function enterClickPercentage(event :KeyboardEvent, ingredientKey: number, phaseKey: number) {
  event.preventDefault();
  await nextTick();

  const nextIngredientKey = ingredientKey + 1;
  const nextElementId = `ingredient-input-${phaseKey}-${nextIngredientKey}`;
  let nextElement = document.getElementById(nextElementId) as HTMLElement;

  if(!nextElement) {
    const nextPhaseKey = phaseKey + 1;
    const nextElementId = `ingredient-input-${nextPhaseKey}-0`;
    nextElement = document.getElementById(nextElementId) as HTMLElement;
  }

  if (nextElement) {
    nextElement.focus();
    nextElement.select();
  } else {
    const currentElementId = `ingredient-input-${phaseKey}-${ingredientKey}`;
    const currentElement = ingredientInputs.value[currentElementId] as HTMLElement;
    if (currentElement) {
      currentElement.blur();
    }
  }
}


</script>

<template>
  <div id="formulating-panel" class="sm:w-5/6 mx-auto py-6 pb-24 hidden md:flex flex-col">
    <div class="flex flex-row justify-around">
      <div
        id="formula-box"
        class="md:w-full lg:w-10/12 flex md:flex flex-col mx-6 px-6 pb-6 rounded-lg bg-slate-200 border-2 border-slate-400"
      >
        <FormulaOperations
          :displayFormula="displayFormula"
          @submitFormula="submitFormula"
          @deleteFormula="deleteFormula"
          @print="print"
          @resetDisplayAndCachedFormula="resetDisplayAndCachedFormula"
          @duplicateFormula="duplicateFormula"
          class="w-full md:full mb-6 h-12 bg-slate-200 rounded-b-xl"
        />

        <h2 v-if="displayFormula.name" class="font-bold text-lg text-center pb-3">
          {{ displayFormula.name }}
        </h2>
        <div class="flex flex-row h-10">
          <div class="flex flex-col w-full">
            <div class="flex flex-row px-2 justify-start">
              <div class="">
                <label for="formula-name w-1/3">name: </label>
              </div>
              <div class="">
                <input
                  type="text"
                  placeholder="New Formula"
                  class="h-6 w-full border-2 border-slate-400 rounded-md"
                  name="formula-name"
                  id="formula-name"
                  v-model.lazy="displayFormula.name"
                />
              </div>

              <div class="flex flex-row px-2 justify-end" v-show="formulaUnit === 'g'">
                <div class="">
                  <label for="formula-weight" class="text-left">amount: </label>
                </div>
                <div class="">
                  <input
                    type="number"
                    name="formula-weight"
                    id="formula-weight"
                    class="h-6 w-2/3 border-2 border-slate-400 rounded-md"
                    v-model="displayFormula.totalWeight"
                    v-on:blur="FormulaHelper.weightUpdate(displayFormula, formulaUnit)"
                  />
                  <!--                              <button @click="toggleMeasurement" class="bg-slate-300 mx-1 px-2 rounded-sm hover:bg-slate-200">{{ formulaUnit }}</button>-->
                </div>
                <UnitSelector @unitSelected="data.setPreferredUnit(formulaUnit)" />
              </div>
              <div class="flex flex-row px-2 justify-end" v-show="formulaUnit === 'Oz'">
                <div class="">
                  <label for="formula-weight" class="text-left">amount: </label>
                </div>
                <div class="">
                  <input
                    type="number"
                    name="formula-weight"
                    id="formula-weight"
                    class="h-6 w-2/3 border-2 border-slate-400 rounded-md"
                    v-model="displayFormula.totalWeightInOunces"
                    v-on:blur="FormulaHelper.weightUpdate(displayFormula, formulaUnit)"
                  />
                  <!--                              <button @click="toggleMeasurement" class="bg-slate-300 mx-1 px-2 rounded-sm hover:bg-slate-200">{{ formulaUnit }}</button>-->
                </div>
                <UnitSelector @unitSelected="data.setPreferredUnit(formulaUnit)" />
              </div>

              <div class="flex flex-row px-2">
                <p class="">remaining:</p>
                <p class="font-semibold px-4 text-end">
                  {{ displayFormula.getAllocatedPercentagesRemaining() }}%
                </p>
              </div>
              <div class="flex flex-row px-2">
                <p class="">cost:</p>
                <p class="font-semibold px-4 text-end" v-if="displayFormula.estimatedCost">
                  ${{ Number(displayFormula.estimatedCost.toFixed(2)) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-1 px-6 pt-1 odd:bg-slate-300 rounded-md border-2 border-slate-400"
          v-for="(phase, phaseKey) in displayFormula.phases"
        >
          <label :for="'phase-name-' + phaseKey" class="px-2">Phase:</label>
          <input
            :id="'phase-name-' + phaseKey"
            placeholder="New Phase"
            v-model="phase.name"
            class="border-2 border-slate-400 rounded-md"
          />
          <div
            class="drop-zone w-full flex flex-row"
            :key="phaseKey"
            :id="'phase-' + phaseKey"
            @drop="onDropFormula($event, phase)"
            @dragenter.prevent
            @dragover.prevent
          >
            <div class="w-full flex flex-col">
              <div class="flex flex-col w-full px-3 mb-4">
                <div class="rounded-sm w-full flex flex-row mb-2">
                  <div class="w-2/6 flex flex-row">
                    <div
                      class="w-full px-2 font-semibold"
                      @click="phase.updateIngredientOrderByName()"
                    >
                      Ingredient
                    </div>
                    <div class="hidden w-1/2 font-semibold">Inci</div>
                  </div>

                  <div class="w-4/6 flex flex-row px-2 mr-10 justify-end gap-3">
                    <div class="w-20 font-semibold" @click="phase.updateIngredientOrder()">
                      Percentage
                    </div>
                    <div class="w-12 font-semibold">Amount</div>
                    <div class="w-24 mr-5 ml-6 font-semibold" v-show="formulaUnit === 'g'">
                      $/kg
                    </div>
                    <div class="w-24 mr-5 ml-6 font-semibold" v-show="formulaUnit === 'Oz'">
                      $/Oz
                    </div>
                    <div class="w-8 font-semibold">Cost</div>
                  </div>
                </div>

                <div
                  v-for="(ingredient, ingredientKey) in getOrderedIngredients(phase).value"
                  :key="ingredientKey"
                  class="drag-el flex flex-row even:bg-slate-200 odd:bg-slate-300 hover:cursor-grab active:cursor-grabbing hover:bg-slate-400"
                  draggable="true"
                  @dragstart="startDragFormula($event, phaseKey, ingredientKey)"
                >
                  <label :for="'ingredient-' + ingredientKey" class="w-2/5 flex flex-row">
                    <div class="w-full px-2">{{ ingredient.name }}</div>
                    <div class="w-1/2 hidden font-thin italic">{{ ingredient.inci }}</div>
                  </label>

                  <div class="w-3/5 flex flex-row mx-2 justify-end gap-1">
                    <div class="flex flex-row w-20 mr-2">
                      <input
                          v-model.lazy="ingredient.percentage"
                          @keydown.up.prevent
                          @keydown.down.prevent
                          @keydown.enter="enterClickPercentage($event, ingredientKey, phaseKey)"
                          v-on:blur="FormulaHelper.updateIngredientWeight(displayFormula, data.settings.preferredUnits, ingredient)"
                          type="number" step="0.01"
                          name="percentage"
                          :id="'ingredient-input-' + phaseKey + '-' + ingredientKey"
                          :ref="'ingredientInput-' + phaseKey + '-' + ingredientKey"
                          class="h-6 w-16 justify-end pl-1"
                      />
                      <p>%</p>
                    </div>

                    <div class="flex flex-row w-10">
                      <p v-if="ingredient.percentage">
                        {{ Number(ingredient.getWeight(formulaUnit)).toFixed(2) }}{{ formulaUnit }}
                      </p>
                    </div>
                    <!--TODO replace with common div that uses global Unit as input to getCost instead of hard coded, same for $/Unit-->
                    <div class="flex flex-row w-24 mr-5 ml-6">
                      <div>{{ Number(ingredient.getCost(formulaUnit)).toFixed(2) }}</div>
                      <div v-if="formulaUnit === 'g'">/kg</div>
                      <div v-else>/Oz</div>
                    </div>

                    <div class="flex flex-row w-10 justify-end">
                      <p v-if="ingredient.percentage">
                        ${{ Number(Number((ingredient.getWeight('g') * ingredient.cost * 0.001).toFixed(2))) }}
                      </p>
                    </div>
                    <font-awesome-icon
                      @click="editIngredient(ingredient)"
                      :icon="['fa', 'gears']"
                      class="my-1 hover:cursor-pointer flex text-slate-600 hover:text-slate-500 text-md"
                    />
                    <font-awesome-icon
                      @click="phase.removeIngredientByIndex(ingredientKey)"
                      :icon="['fa', 'circle-xmark']"
                      class="my-1 hover:cursor-pointer flex hover:text-red-700 text-slate-600 text-md"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-row justify-between">
                <div class="flex flex-col w-1/2 pt-0">
                  <div class="flex-row">
                    <button
                      @click="FormulaHelper.removePhase(displayFormula, phaseKey)"
                      class="bg-slate-400 hover:bg-red-400 px-2 mx-2 rounded-md font-semibold h-8 text-white"
                    >
                      Delete
                    </button>
                    <button
                      @click="toggleDescShow(phaseKey)"
                      class="bg-slate-400 px-2 mx-2 h-8 text-white rounded-md font-semibold hover:cursor-pointer hover:bg-slate-500"
                      :for="'phase-desc-' + phaseKey"
                    >
                      Description
                    </button>
                  </div>

                  <div class="flex flex-col py-2">
                    <div class="" v-show="showPhaseDescs.has(phaseKey)">
                      <textarea
                        class="h-20 w-full"
                        v-model="phase.description"
                        placeholder="description"
                        :id="'phase-desc-' + phaseKey"
                        resize="none"
                        rows="4"
                        cols="40"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <search-ingredient-box :phase-key="phaseKey" :phase="phase" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full justify-between mt-1">
          <div class="flex flex-row justify-start">
            <button
              @click="FormulaHelper.addPhase(displayFormula)"
              class="bg-slate-400 hover:bg-slate-500 px-2 mx-2 h-8 rounded-md font-semibold text-white"
            >
              <font-awesome-icon icon="plus" /> Add Phase
            </button>
            <!--                        <button @click="addPhase" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Add Phase</button>-->
            <!--                        <button @click="print(displayFormula)" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Print</button>-->
          </div>

          <div v-if="displayFormula.saveStatus === 'new'" class="flex flex-row justify-end">
            <button
              @click="toggleShowDetails"
              class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 h-8 rounded-md font-semibold text-white"
            >
              <font-awesome-icon icon="fa-circle-info" /> Details
            </button>
          </div>
          <div v-else class="flex flex-row justify-end">
            <button
              @click="toggleShowDetails"
              class="bg-slate-400 hover:bg-slate-500 px-2 mx-2 h-8 rounded-md font-semibold text-white"
            >
              <font-awesome-icon icon="fa-circle-info" /> Details
            </button>
          </div>
        </div>
        <formula-details v-if="showDetails" :formula="displayFormula" @close="toggleShowDetails" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
