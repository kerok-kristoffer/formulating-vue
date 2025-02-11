<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, provide, ref, toRef, unref, watch} from "vue";
import axios from 'axios';
import Ingredient from "../types/Ingredient";
import Formula from "../types/Formula";
import Tag from "../types/Tag";
import { useAccountStore } from "../stores/account";
import { userData } from "../stores/userData";
import FilterBox from "../components/FilterBox.vue";
import FormulaPrintPage from "../components/FormulaPrintPage.vue";
import FormulaList from "../components/FormulaList.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import EditIngredientComponent from "@/components/EditIngredientComponent.vue";
import FormulatingPanel from "@/components/FormulatingPanel.vue";
import IngredientList from "@/types/IngredientList";
import AlertPopup from "@/components/AlertPopup.vue";
import FormulaFactory from "@/types/FormulaFactory";
import FormulaHelper from "@/types/FormulaHelper";
import FormulatingPanelMobile from "@/components/FormulatingPanelMobile.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

const formulaUnit = computed(() => userData().settings.preferredUnits)
const formulaList = ref<Formula[]>([])
const newIngredient = ref(new Ingredient(0, 0, "", "", 0, 0,  []))
const ingInput = ref<any>(null)
const accountStore = useAccountStore()
const filteredIngredients = ref<Ingredient[]>([])
const data = userData()
const displayFormulaList = ref(data.displayFormulaList);
const displayIngredientList = ref(false);
let foundInFormulasList = ref<Formula[]>([]);
const showEditWindow = ref(false);
const selectedItemCopy = ref<Ingredient>(newIngredient.value)
const displayFormulaIngredientsList = ref(new IngredientList()) ;
const loaded = ref(false)

let displayFormula = ref<Formula>(FormulaFactory.createDefaultFormula())
onMounted(async () => {
  // TODO evaluate if these are needed, or if they should be accessed directly from userData when needed
  filteredIngredients.value = data.ingredientList.getFilteredIngredients()
  if (userData().debug) {
    console.log("filtered ingredients: " + filteredIngredients.value.length)
  }
  formulaList.value = data.formulaList.formulas

  displayFormula = ref(data.getReactiveDisplayFormula() as Formula)
  if (userData().debug) {
    console.log("FormulasView mounted with displayFormula: " + displayFormula.value.name)
  }
  window.addEventListener('keydown', handleKeydown);

  loaded.value = true
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function handleKeydown(event) {
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return;
  }

  if (event.key === 'Escape') {
    if (showEditWindow.value) {
      closeEditIngredientWindow();
      return
    } // todo perhaps move these to the actual components, or make a 'closable' interface that handles it
    if (isDeleteAlertVisible.value) {
      handleDeleteAlertNoClick();
      return
    }
    if (isDirtyDisplayFormulaAlertVisible.value) {
      handleDirtyFormulaAlertCancelClick();
      return
    }
    closePanels()
  }

  if (event.key === ' ') {
    closePanels()
  }
}

function closePanels() {
  data.displayFormulaList = false;
  displayIngredientList.value = false;
}

function toggleDisplayFormulaList() {
  data.toggleFormulaListPanel()
}

function toggleDisplayIngredientList() {
  displayIngredientList.value = !displayIngredientList.value;
}

function triggerSetDisplayFormula(pinListView :boolean, clickedFormula) {

  data.attemptSetDisplayFormula(clickedFormula)
  if (!pinListView) {
    data.toggleFormulaListPanel()
  }
}

const setDisplayFormula = (pinListView :boolean, clickedFormula :Formula) => { // TODO: save "new" formulas as temporary? could load cached when pressing new formula button again?

  clickedFormula.saveStatus = 'edited'
  data.setDisplayFormula(clickedFormula, "setDisplayFormula, FormulasView 77")
  clickedFormula.updateCost(data.settings.preferredUnits)
  let formulaIngredients: Ingredient[] = [];

  clickedFormula.phases.forEach((phase) => {
    phase.updateIngredientOrder();
    formulaIngredients.concat(phase.getIngredients());
  })
  if (userData().debug) {
    console.log("setting cached formula = display formula: " + clickedFormula.name)
  }
  data.setCachedFormula(clickedFormula);

  if (!pinListView) {
    displayFormulaList.value = false;
  }
}

const toggleFilter = (tag :Tag)  => {
    data.ingredientList.toggleFilter(tag);
    filteredIngredients.value = data.ingredientList.getFilteredIngredients();
}

const resetDisplayFormula = () => {
  if (userData().debug) {
    console.log("resetting display formula to cookie value" )
  }
  let resetFormula = data.formulaList.resetFormulaToCookieFormula(data.displayFormula)

  if (userData().debug) {
    console.log("resetting display formula resetFormula " + resetFormula.name)
  }
  data.resetDisplayFormula()
}

function restoreFormula(currentFormula :Formula, wantedFormula :Formula) {
  if (userData().debug) {
    console.log("resetting all values for " + currentFormula.name)
  }
  currentFormula.name = wantedFormula.name
  currentFormula.totalWeight = wantedFormula.totalWeight
  currentFormula.totalWeightInOunces = wantedFormula.totalWeightInOunces
  currentFormula.phases = wantedFormula.phases
  currentFormula.updated_at = wantedFormula.updated_at
  currentFormula.created_at = wantedFormula.created_at
  currentFormula.description = wantedFormula.description
  currentFormula.saveStatus = wantedFormula.saveStatus
  currentFormula.updateWeights(formulaUnit.value)
  currentFormula.updateCost(formulaUnit.value)

  if (userData().debug) {
    console.log("comparing current to wanted formula")
    if (!currentFormula.equals(wantedFormula)) {
      console.log("current formula does not match wanted formula")
    }
  }
}

const resetDisplayAndCachedFormula = () => {
  data.attemptSetDisplayFormula(FormulaFactory.createDefaultFormula())
}

const startDrag = (event, ingredientId: number | string) => {
    event.dataTransfer.dropEffect = 'copy'
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('ingredientListIndex', ingredientId)
  const ingredient = data.ingredientList.ingredients.find(ing => ing.id === ingredientId);
  data.setDragIngredient(ingredient)
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

function editIngredient(ingredient :Ingredient) {

  displayFormulaIngredientsList.value.populateWithList(data.displayFormula.getIngredientList());

  if (userData().debug) {
    console.log("editIngredient: " + ingredient.name)
    console.log(displayFormulaIngredientsList.value.ingredients)
  }

  displayFormulaIngredientsList.value.setHighlightIngredient(ingredient);

  let ingredientIndex = displayFormulaIngredientsList.value.ingredients.findIndex((ing) => ing.equals(ingredient));
  displayFormulaIngredientsList.value.setHighlightIndex(ingredientIndex); // todo move this to IngredientList
  if (userData().debug) {
    console.log("highlight index: " + displayFormulaIngredientsList.value.getHighlightIndex())
    console.log("highlight ingredient: " + displayFormulaIngredientsList.value.getHighlightIngredient().name)
  }
  selectedItemCopy.value = displayFormulaIngredientsList.value.getHighlightIngredientCopy();
  showEditWindow.value = true;
}


const closeEditIngredientWindow = () => {
  showEditWindow.value = false;
  data.ingredientList.populateWithTags().then(
    () => {
      data.ingredientList.filterIngredientList();
      data.ingredientList.refreshIngredient(displayFormulaIngredientsList.value.getHighlightIngredient());
// todo - make sure this updates the costs displayed in the display formula
      nextTick(() => {
        filteredIngredients.value = data.ingredientList.getFilteredIngredients();
        updateFormulaCost();
      });
    }
  );
}

const weightUpdate = (formula :Formula) :void => {
    formula.updateWeights(formulaUnit.value)
    formula.updateCost(formulaUnit.value)
}

const updateFormulaCost = () => {
    displayFormula.value.updateCost(formulaUnit.value)
}

const print = () => {
    window.print()
}

function formulaSubmitted() {
  if (userData().debug) {
    console.log("formula submitted, add implementation...")
  }
}

const submitFormula = () => {

  if (userData().debug) {
    console.log("temporarily disabled submit formula in FormulasView...")
  }
  return;

  if (displayFormula.value.saveStatus === 'new') {
    submitNewFormula()
  } else {
    submitUpdateFormula()
  }
}
// TODO make alert global (inside of authenticated content, like notify)
// todo consolidate all alerts to use the same alert component, cancel should do nothing but hide the alert
  // callbacks should be defined by the function calling the alert, for both yes and no clicks
  // make sure to reset the callback after the alert is hidden
// make sure to replace alert calls from Ingredients and from FormulasView
// TODO add a function that overrides the displayFormula/cacehdFormula
  // this function should be used in all cases of displayFormula changing
  // this is where the dirty check should be made and call hte alert
// TODO ensure that the cached Formula is set at appropriate times, and that it is updated when the displayFormula is saved/refreshed!

function submitNewFormula() {
  axios.post("users/formulas", displayFormula.value).then(response => {
    if(response.status === 200) {
      data.formulaList.addToFormulaListFromApiData(response.data)
      formulaList.value = data.formulaList.formulas;

      displayFormula.value.saveStatus = 'saved'
      displayFormula.value.id = response.data.id
      data.setCachedFormula(displayFormula.value)
      accountStore.notify(displayFormula.value.name + " formula saved", "success")
    }
  })
}

const isDeleteAlertVisible = ref(false)
const isDirtyDisplayFormulaAlertVisible = ref(false)

function deleteFormulaConfirmed() {

  FormulaHelper.deleteFormula(data.displayFormula).then(() => {
    data.formulaList.removeFormula(data.displayFormula)
    let cleanFormula = FormulaFactory.createDefaultFormula();
    data.setDisplayFormula(cleanFormula, "deleteFormulaConfirmed, FormulasView 77")
    data.setCachedFormula(cleanFormula)
  })
}

const deleteFormula = () => {
  isDeleteAlertVisible.value = true
}
type CallbackFunction = (arg?: any) => void;
let callBack: CallbackFunction;

function handleDeleteAlertYesClick(callback: CallbackFunction) {
 callback();
 isDeleteAlertVisible.value = false;
}

function handleDeleteAlertNoClick() {
 isDeleteAlertVisible.value = false;
}

function handleAlertCancelClick() {
 isDeleteAlertVisible.value = false;
}

function handleDirtyFormulaAlertResponse(saveChanges: boolean, pinListView: boolean, clickedFormula: Formula) {
  if (saveChanges) { // TODO consolidate delete and dirty to use same Alert component using better callbacks
    submitFormula();
  } else {
    if (userData().debug) {
      console.log("resetting display formula to cached formula")
    }
    resetDisplayFormula();
  }

  setDisplayFormula(pinListView, clickedFormula)
}

function handleDirtyFormulaAlertCancelClick() {
  callBack = () => void{};
  isDirtyDisplayFormulaAlertVisible.value = false;
}

const submitUpdateFormula = () => {
    let url = "users/formulas/" + displayFormula.value.id
    axios.post(url, displayFormula.value).catch(error => {
        accountStore.notify(error.response.data, 'error')
        return
    }).then(response => {
        if (!response) {
            return
        }
        
        displayFormula.value.saveStatus = 'saved'
        displayFormula.value.updated_at = response.data.updated_at
        accountStore.notify(displayFormula.value.name + " formula updated", "success")
        data.setCachedFormula(displayFormula.value)
        })
}

const submitIngredient = (ingredient :Ingredient) => {

  if (ingredient.name === "") {
    accountStore.notify("Ingredient name cannot be empty", "error")
    return
  }

    axios.post('users/ingredients', ingredient).then(response => {
        if (response.status !== 200) {
            return
        }
        let ing = response.data
        data.ingredientList.ingredients.value.push(new Ingredient(data.ingredientList.ingredients.value.length, Number(ing.Id), ing.Name, ing.Inci, ing.percentage, ing.cost, []))
        data.ingredientList.ingredients.sort()
        newIngredient.value = new Ingredient(0, 0, "", "", 0, 0, [])
        ingInput.value.focus()
    });
}

watch(
    () => userData().displayFormula,
    (newFormula) => {
      userData().setDirtyCachedFormula(newFormula);
    },
    { deep: true }
);



</script>

<template>
  <div v-if="loaded" class="drop-zone h-full"
       @drop="onDrop($event)"
       @dragenter.prevent
       @dragover.prevent
  >
    <div id="formula-list-panel"
         @click="toggleDisplayFormulaList"
         class="fixed top-28 md:top-20 z-10 h-4/5
       md:h-5/6 md:bg-slate-200 rounded-r-xl
       md:flex md:flex-row md:border-2 md:border-l-0 border-slate-400">
      <formula-list v-if="data.displayFormulaList" @clickFormula="triggerSetDisplayFormula" class="overflow-y-auto w-72 print:hidden"/>
      <font-awesome-icon
          v-if="!data.displayFormulaList"
          :icon="['fa', 'file-lines']"
          class="top-1/2 mx-1 hidden md:flex text-slate-400 text-3xl" />
    </div>

    <div id="ingredient-list-panel"
         @click="toggleDisplayIngredientList"
         class="fixed top-20 hidden md:flex md:flex-row z-10 right-0 rounded-l-xl bg-slate-200 h-5/6 border-2 border-r-0 border-slate-400">
      <font-awesome-icon
          v-if="!displayIngredientList"
          :icon="['fa', 'file-lines']"
          class="top-1/2 ml-1 text-slate-400 text-3xl" />
      <div v-if="displayIngredientList" id="ingredient-list"
           class="right-0 w-72 hidden bg-slate-200 rounded-l-xl md:block h-full">
        <div class="drop-zone w-full h-3/4 overflow-y-scroll"
             @drop="onDrop($event)"
             @dragenter.prevent
             @dragover.prevent
        >

          <h2
              class="py-1 w-full bg-slate-300 font-bold rounded-tl-xl text-center">Ingredients</h2>
          <div class="w-full overflow-auto">
            <ul
                v-for="item in data.ingredientList.getFilteredIngredients()"
                :key="item.id"
                @click.stop
                class="drag-el
                            px-1 py-1
                            even:bg-slate-100
                            odd:bg-slate-200
                            hover:bg-slate-300
                            hover:cursor-grab
                            active:cursor-grabbing
                            "
                draggable="true"
                @dragstart="startDrag($event, item.id)"
            >
              <li class="flex flex-row w-full">
                <p class="w-full font-semibold">{{ item.name }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex flex-row w-full h-1/12 my-3 ml-1">
          <input
              class="w-1/2 font-thin text-xs"
              placeholder="new ingredient"
              v-model="newIngredient.name"
              type="text"
              name="Name"
              ref="ingInput"
              @click.stop
          />

          <button
              class="bg-slate-400 px-2 hover:bg-slate-300 mx-1 rounded-md text-sm font-semibold"
              value="Add"
              @click="submitIngredient(newIngredient)" @click.stop>Add</button>
        </div>

        <FilterBox v-if="data.ingredientList.tags" :tags="data.ingredientList.tags" @toggleFilter="toggleFilter" class="h-1/12"/>

      </div>
    </div>

    <FormulatingPanelMobile
        :displayFormula="data.getReactiveDisplayFormula()"
        :freeVersion="false"
        @submitFormula="formulaSubmitted"
        @deleteFormula="deleteFormula"
        @print="print"
        @resetDisplayAndCachedFormula="resetDisplayAndCachedFormula"
        @editIngredient="editIngredient"
    />

    <FormulatingPanel
        :displayFormula="data.getReactiveDisplayFormula()"
        :freeVersion="false"
        @submitFormula="formulaSubmitted"
        @deleteFormula="deleteFormula"
        @print="print"
        @resetDisplayAndCachedFormula="resetDisplayAndCachedFormula"
        @editIngredient="editIngredient"
    />

    <edit-ingredient-component v-if="showEditWindow"
                               :ingredient-list="displayFormulaIngredientsList"
                               :item="displayFormulaIngredientsList.getHighlightIngredient()"
                               :itemCopy="selectedItemCopy"
                               :ingredient-in-formulas="foundInFormulasList"
                               @close="closeEditIngredientWindow"/>

    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" v-if="isDeleteAlertVisible">
      <AlertPopup
          :promptText="'Are you sure you want to delete this formula?'"
          :callback="deleteFormulaConfirmed"
          @yes-click="handleDeleteAlertYesClick"
          @no-click="handleDeleteAlertNoClick"
          @cancel-click="handleAlertCancelClick"
      />
    </div>
    <formula-print-page :display-formula="userData().displayFormula" :formula-unit="formulaUnit" />
  </div>

  <LoadingIndicator v-else />

  <div v-if="userData().debug" class="debug-info fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-2 border-slate-400 rounded-md p-2 shadow-md">
    <p >current displayFormula: {{data.getReactiveDisplayFormula().name}} id: {{data.getReactiveDisplayFormula().id}}</p>
    <p v-if="data.getCachedFormula()">current cachedFormula: {{data.getCachedFormula().name}} id {{data.getCachedFormula().id}}</p>
    <p v-if="data.getDirtyCachedFormula()">current dirtyCachedFormula: {{data.getDirtyCachedFormula()}}</p>
    <p>{{data.ingredientList.ingredients.length}}</p>
    <p>{{displayFormulaIngredientsList.ingredients.length}}</p>
    <p>{{data.getReactiveDisplayFormula().toString()}}</p>
    <p v-if="displayFormulaIngredientsList.getHighlightIngredient()">{{displayFormulaIngredientsList.getHighlightIngredient().name}}</p>
    <p v-if="data.getDragIngredient()">dragging: {{data.getDragIngredient()}}</p>
    <div v-if="data.ingredientList.ingredients">

  </div>
</div>

    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" v-if="isDirtyDisplayFormulaAlertVisible">
      <AlertPopup
          :promptText="'Formula has been altered, do you want to save changes?'"
          :callback="callBack"
          @yes-click="() => handleDirtyFormulaAlertResponse(true)"
          @no-click="() => handleDirtyFormulaAlertResponse(false)"
          @cancel-click="handleDirtyFormulaAlertCancelClick"
      />
    </div>

</template>
