<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import axios from 'axios';
import Ingredient from "../types/Ingredient";
import Formula from "../types/Formula";
import Phase from "../types/Phase";
import Units from "../types/Units";
import Tag from "../types/Tag";
import { useAccountStore } from "../stores/account";
import { userData } from "../stores/userData";
import FilterBox from "../components/FilterBox.vue";
import FormulaPrintPage from "../components/FormulaPrintPage.vue";
import SearchIngredientBox from "../components/SearchIngredientBox.vue";
import FormulaList from "../components/FormulaList.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import ButtonStandard from "@/components/ButtonStandard.vue";
import ButtonDanger from "@/components/ButtonDanger.vue";
import EditIngredientComponent from "@/components/EditIngredientComponent.vue";
import FormulaDetails from "@/components/FormulaDetails.vue";

const ingredients = ref<Ingredient[]>([])
const formulaUnit = ref<Units>('g')
const formulaList = ref<Formula[]>([])
const newIngredient = ref(new Ingredient(0, 0, "", "", 0, []))
const ingInput = ref<any>(null)
const accountStore = useAccountStore()
const tags = ref<Tag[]>([])
const filteredIngredients = ref<Ingredient[]>([])
const showPhaseDescs = ref(new Set())
const data = userData()
let ingredientList = null;
const displayFormulaList = ref(false);
const displayIngredientList = ref(false);
let foundInFormulasList = ref<Formula[]>([]);
const showEditWindow = ref(false);
let showDetails = ref(false);

onMounted(async () => {
  populateIngredientListWithTags();
  filteredIngredients.value = ingredients.value;

  formulaList.value = data.formulaList.formulas

});

function populateIngredientListWithTags() {
  ingredientList = data.ingredientList;
  ingredients.value = ingredientList.ingredients;
  tags.value = ingredientList.tags;
}

function toggleDisplayFormulaList() {
  displayFormulaList.value = !displayFormulaList.value;
}

function toggleDisplayIngredientList() {
  displayIngredientList.value = !displayIngredientList.value;
}

const setDisplayFormula = (formula :Formula, pinListView :boolean) => { // TODO: save "new" formulas as temporary? could load cached when pressing new formula button again?
    formula.saveStatus = 'edited'
    displayFormula.value = formula
    displayFormula.value.updateCost(formulaUnit.value)
  displayFormula.value.phases.forEach((phase) => {
    phase.updateIngredientOrder();
  })
  accountStore.setCachedFormula(displayFormula.value);
  if (!pinListView) {
    displayFormulaList.value = false;
  }
}

const toggleFilter = (tag :Tag)  => {
    ingredientList.toggleFilter(tag);
    filteredIngredients.value = ingredientList.getFilteredIngredients();
}


let defaultEmptyPhases = [] as Phase[]
defaultEmptyPhases.push(new Phase(0, 'A', []))

const displayFormula = ref<Formula>(new Formula("New Formula", defaultEmptyPhases, 100, 'new', '', ''))
if(accountStore.cachedFormula !== null) {
    displayFormula.value = accountStore.cachedFormula
  console.log("cached formula found: " + displayFormula.value.name)
  displayFormula.value.phases.forEach((phase) => {
    phase.updateIngredientOrder();
  })
} else {
 console.log("no cached formula");
}
accountStore.setCachedFormula(displayFormula.value) // TODO figure out why this is not working, and fix it, should be saved in cookies.

const resetDisplayFormula = () => {
    defaultEmptyPhases = [] as Phase[]
    defaultEmptyPhases.push(new Phase(0, 'A', []))
    if(accountStore.cachedFormula !== null) {
        displayFormula.value = accountStore.cachedFormula
    } else {
        displayFormula.value = new Formula("New Formula", defaultEmptyPhases, 100, 'new', '', '')
    }
}

const addPhase = () => {
    displayFormula.value.phases.push(new Phase(0, 'New Phase', []))
}

const deletePhase = (index :number) => {
    displayFormula.value.phases.splice(index, 1)
}

const resetDisplayAndCachedFormula = () => {
    accountStore.cachedFormula = null
    resetDisplayFormula()
}

const onDropFormula = (event, dropPhase :Phase) => {
        // todo: possible to transfer Ingredient object instead of strings?
    let ingredientListIndex = event.dataTransfer.getData('ingredientListIndex')
    let ingredientIndex = event.dataTransfer.getData('ingredientPhaseIndex')

    const fromPhaseKey = event.dataTransfer.getData('phaseKey')
    if (fromPhaseKey) {
        ingredientDropFromPhase(ingredientIndex, fromPhaseKey, dropPhase)
    } else {
        ingredientDropFromIngredientList(ingredientListIndex, dropPhase)
    }
}

const ingredientDropFromIngredientList = (ingredientListIndex :number, dropPhase :Phase) => {
    let ingredient = ingredients.value.find((i) => i.id == ingredientListIndex)

    if(ingredient != undefined) {
        dropPhase.addIngredient(new Ingredient(0, ingredient.ingredient_id, ingredient.name, ingredient.inci, Number(ingredient.cost), []))
        return
    }
}

const ingredientDropFromPhase = (ingredientIndex :number, fromPhaseKey :number, dropPhase :Phase) => {
        
    const phaseToRemoveFrom = displayFormula.value.phases[fromPhaseKey]
    if (phaseToRemoveFrom === undefined) {
            console.log("phase is undefined")
    } else {
        
        let ingredient = phaseToRemoveFrom.removeIngredientByIndex(ingredientIndex)
        dropPhase.addIngredient(ingredient)
    }
}

const startDrag = (event, ingredientId: number | string) => {
    event.dataTransfer.dropEffect = 'copy'
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('ingredientListIndex', ingredientId)
}

const startDragFormula = (event, phaseKey: number, ingredientIndex: number | string) => {
    event.dataTransfer.dropEffect = 'copy'
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('phaseKey', phaseKey)
    event.dataTransfer.setData('ingredientPhaseIndex', ingredientIndex)
}

const onDrop = (event) => {
    
    const ingredientId = event.dataTransfer.getData('ingredientPhaseIndex')
    const phaseKey = event.dataTransfer.getData('phaseKey')
    const phase = displayFormula.value.phases[phaseKey]
    if (phase !== undefined) {
        const ingredients :Ingredient[] = phase.ingredients
        ingredients.splice(ingredientId, 1)
        weightUpdate(displayFormula.value)
    } else {
    }
}

function removeIngredientFromPhase(ingredientId :Number, phase :Phase) {
    const ingredients :Ingredient[] = phase.ingredients
    ingredients.splice(ingredientId, 1)
    weightUpdate(displayFormula.value)
}

 // TODO probably need to give a list of ingredients to component depending on which view we are in
function editIngredient(ingredient :Ingredient) {
    ingredientList.setHighlightIngredient(ingredient);
    ingredientList.setHighlightIndex(ingredients.value.indexOf(ingredient))
    showEditWindow.value = true;
}

const closeEditIngredientWindow = () => {
  showEditWindow.value = false;
  data.ingredientList.populateWithTags().then(
    () => {
      populateIngredientListWithTags();
      ingredientList.filterIngredientList();
      ingredientList.refreshIngredient(ingredientList.getHighlightIngredient());

      nextTick(() => {
        filteredIngredients.value = ingredientList.getFilteredIngredients();
        updateFormulaCost();
      });
    }
  );
}

function inFormulas(ingredient :Ingredient) :Formula[] {

  let filter = formulaList.value.filter((formula) => {
    return formula.hasIngredient(ingredient);
  });
  return filter;
}

const toggleMeasurement = () :void => {
    if (formulaUnit.value === 'g') {
        formulaUnit.value = 'Oz'
    } else if (formulaUnit.value === 'Oz') {
        formulaUnit.value = 'g'
    }
}

const weightUpdate = (formula :Formula) :void => {
    formula.updateWeights(formulaUnit.value)
    formula.updateCost(formulaUnit.value)
}

const updateIngredientWeight = (ingredient :Ingredient, phase :Phase) :void => {
    let ingredientWeight = displayFormula.value.getWeight(formulaUnit.value) * ingredient.percentage * 0.01
    ingredient.setWeight(ingredientWeight, formulaUnit.value)
    
    displayFormula.value.updateWeights(formulaUnit.value)
    displayFormula.value.updateCost(formulaUnit.value)
}

const updateFormulaCost = () => {
    displayFormula.value.updateCost(formulaUnit.value)
}

const print = (formula :Formula) => {
    window.print()
}

const toggleDescShow = (index :number) => {
    if (showPhaseDescs.value.has(index)) {
        showPhaseDescs.value.delete(index)
    } else {
        showPhaseDescs.value.add(index)
    }
    
}

const submitFormula = () => {
    axios.post("users/formulas", displayFormula.value).then(response => {
        if(response.status === 200) {
            data.formulaList.addToFormulaListFromApiData(response.data)
            formulaList.value = data.formulaList.formulas;
            formulaList.value.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 }); // TODO move this to FormulaList class
            
            displayFormula.value.saveStatus = 'saved'
            displayFormula.value.id = response.data.id
            accountStore.notify(displayFormula.value.name + " formula saved", "success")
        }
    })
}

const deleteFormula = () => {
    axios.delete("users/formulas/" + displayFormula.value.id).catch(error => {
        accountStore.notify(error.response, 'error')
        return
    }).then(response => {
        for (let i in data.formulaList.formulas) {
            if (data.formulaList.formulas[i].id == displayFormula.value.id) {
                console.log("deleting:" + displayFormula.value.id + " at: " + i);
                data.formulaList.formulas.splice(Number(i), 1)
                break;
            }
        }
        resetDisplayAndCachedFormula();
    })
}

const submitUpdateFormula = () => {
    // TODO kerok: add error messages for faulty inputs in front-end, ie 0g for updateFormula
    if(displayFormula.value.getWeight('g') == 0) {
        //accountStore.notify("Formula amount can not be 0", "error") // todo: allow this instead!
    }
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
        })
        
}

const submitIngredient = (ingredient :Ingredient) => {

    axios.post('users/ingredients', ingredient).then(response => {
        if (response.status !== 200) {
            return
        }
        let ing = response.data
        ingredients.value.push(new Ingredient(ingredients.value.length, Number(ing.Id), ing.Name, ing.Inci, ing.cost, []))
        ingredients.value.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 });
        newIngredient.value = new Ingredient(0, 0, "", "", 0, [])
        ingInput.value.focus()
    });
}

function toggleShowDetails() {
  showDetails.value = !showDetails.value;
}


</script>

<template>

  <div id="formula-list-panel" class="fixed top-28 md:top-20 z-10 md:h-2/3 md:bg-slate-200 rounded-r-xl md:flex md:flex-row md:border-2 md:border-l-0 border-slate-400">
    <formula-list v-if="displayFormulaList" @clickFormula="setDisplayFormula" class="overscroll-auto overflow-auto w-72"/>
    <font-awesome-icon @click="toggleDisplayFormulaList" :icon="['fa', 'file-lines']" class="top-1/2 mx-1 hidden md:flex text-slate-400 text-3xl" />
  </div>

  <div id="ingredient-list-panel" class="fixed top-20 hidden md:flex md:flex-row z-10 right-0 rounded-l-xl bg-slate-200 h-2/3 border-2 border-r-0 border-slate-400">
    <font-awesome-icon @click="toggleDisplayIngredientList" :icon="['fa', 'file-lines']" class="top-1/2 ml-1 text-slate-400 text-3xl" />
    <div v-if="displayIngredientList" id="ingredient-list" class="right-0 w-72 ml-2 hidden bg-slate-200 md:block h-full">
      <div class="drop-zone w-full h-3/4 overflow-y-scroll"
           @drop="onDrop($event)"
           @dragenter.prevent
           @dragover.prevent
      >

        <h2 class="py-1 w-full bg-slate-300 font-bold rounded-t-md text-center">Ingredients</h2>
        <div class="w-full overflow-auto">
          <ul
              v-for="item in filteredIngredients"
              :key="item.id"
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
              <p class="w-1/2 font-semibold">{{ item.name }}</p>
              <p class="w-1/2 font-thin italic">{{ item.inci}}</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex flex-row w-full h-1/12 my-3">
        <input
            class="w-1/2 font-thin text-xs"
            placeholder="new ingredient"
            v-model="newIngredient.name"
            type="text"
            name="Name"
            ref="ingInput"
        />
        <input
            class="w-1/3 font-thin text-xs"
            v-model="newIngredient.inci"
            placeholder="INCI"
            type="text"
            name="Inci" />

        <button
            class="bg-slate-400 px-2 hover:bg-slate-300 mx-1 rounded-md text-sm font-semibold"
            value="Add"
            @click="submitIngredient(newIngredient)">Add</button>
      </div>

      <FilterBox v-if="tags" :tags="tags" @toggleFilter="toggleFilter" class="h-1/12"/>

    </div>
  </div>

    <div id="mobile-formulating-panel" class="md:hidden print:hidden w-full bg-slate-100 pt-3">
      <font-awesome-icon @click="toggleDisplayFormulaList" :icon="['fa', 'file-lines']" class=" ml-1 text-slate-400 text-3xl" />
      <p class="text-xl text-center">
        <!-- add displayFormula.name input  -->
        <input type="text" placeholder="New Formula" class="h-6 w-2/5 bg-transparent border-0" name="formula-name" id="formula-name" v-model.lazy="displayFormula.name">
        <input type="number" v-model="displayFormula.totalWeight" v-on:blur="weightUpdate(displayFormula)" class="h-6 w-1/5 text-right bg-transparent border-0">g
      </p>

      <ul v-for="(phase, phaseKey) in displayFormula.phases" class="flex flex-col odd:bg-slate-300 text-xs">
        <li class="w-full flex flex-col mb-2"
             :key="phaseKey"
             :id="'phase-' + phaseKey"
        >
          <div class="flex flex-row justify-between mb-0.5">
            <input :id="'mobile-phase-name-' + phaseKey" v-model="phase.name"  class="text-lg bg-transparent"/>
            <ButtonDanger :text="'X'" @click="deletePhase(phaseKey)" class="w-1/12"/>
          </div>
          <ul v-for="ing, ingKey in phase.ingredients" class="flex flex-col ml-2">
            <li class="flex flex-row my-0.5">
              <div class="w-4/12">
                {{ ing.name }}
              </div>
              <div class="w-2/12 inline-flex">
                <input type="number" v-model="ing.percentage" v-on:blur="updateIngredientWeight(ing, phase)" class="text-xs text-right border-0 h-4 w-3/4 p-0.5 bg-transparent"/>%
              </div>
              <div class="w-2/12 text-right"> {{ Number(ing.getWeight('g')).toFixed(2) }}g</div>
              <div class="w-2/12 inline-flex">
                <input type="number" v-model="ing.cost" v-on:blur="updateFormulaCost()" class="w-3/4 text-xs h-4 border-0 text-right p-0.5 bg-transparent"/> $/kg
              </div>
              <div class="w-2/12 text-right pr-1" v-if="displayFormula.estimatedCost">${{Number((ing.getWeight('g') * ing.cost * 0.001 ).toFixed(2)) }}</div>
              <font-awesome-icon @click="phase.removeIngredientByIndex(ingKey)" :icon="['fa', 'circle-xmark']" class="mx-1 hidden md:flex text-slate-400 text-md" />
            </li>

          </ul>
          <search-ingredient-box :phase="phase" :phase-key="phase" />
        </li>
      </ul>
      <div class="flex flex-row justify-end w-full text-lg">
        <div class="w-8/12"></div>
        <div class="w-2/12">{{100 - displayFormula.getAllocatedPercentagesRemaining()}}%</div>
        <div class="mr-10">${{Number(displayFormula.estimatedCost).toFixed(2)}}</div>
      </div>
      <div class="flex flex-row gap-2 justify-end w-full text-lg">
        <ButtonStandard :text="'Add Phase'" @click="addPhase" class="w-full"/>
        <ButtonDanger :text="'Delete'" @click="deleteFormula" class="w-full"/>
        <ButtonStandard :text="'Save'" @click="submitFormula" class="w-full"/>
      </div>


    </div>

    <div id="formulating-panel" class="sm:w-5/6 mx-auto py-6 pb-24 hidden md:flex flex-col">
        
        <div class="flex flex-row justify-around">
            <div id="formula-box" class="md:w-full lg:w-10/12 flex md:flex flex-col md:mx-6 p-6 rounded-lg bg-slate-200">

                <h2 v-if="displayFormula.name" class="font-bold text-lg text-center pb-3">{{displayFormula.name}}</h2>
                <div class="flex flex-row h-10">
                    <div class="flex flex-col w-full">
                        <div class="flex flex-row px-2 justify-start">
                            <div class="">
                                <label for="formula-name w-1/3">name: </label>
                            </div>
                            <div class="">
                                <input type="text" 
                                placeholder="New Formula"
                                class="h-6 w-full border-2 border-slate-400 rounded-md"
                                name="formula-name" 
                                id="formula-name" 
                                v-model.lazy="displayFormula.name">
                            </div>

                          <div class="flex flex-row px-2" v-show="formulaUnit==='g'">
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
                                  v-on:blur="weightUpdate(displayFormula)">
                              <button @click="toggleMeasurement" class="bg-slate-300 mx-1 px-2 rounded-sm hover:bg-slate-200">{{ formulaUnit }}</button>
                            </div>
                          </div>
                          <div class="flex flex-row px-2" v-show="formulaUnit==='Oz'">
                            <div class="">
                              <label for="formula-weight" class="text-left">amount: </label>
                            </div>
                            <div class="">
                              <input
                                  type="number"
                                  name="formula-weight"
                                  id="formula-weight"
                                  class="h-6 w-2/3"
                                  v-model="displayFormula.totalWeightInOunces"
                                  v-on:blur="weightUpdate(displayFormula)">
                              <button @click="toggleMeasurement" class="bg-slate-300 mx-1 px-2 rounded-sm hover:bg-slate-200">{{ formulaUnit }}</button>
                            </div>
                          </div>

                          <div class="flex flex-row px-2">
                            <p class="">remaining: </p>
                            <p class="font-semibold px-4 text-end">{{ displayFormula.getAllocatedPercentagesRemaining() }}%</p>
                          </div>
                          <div class="flex flex-row px-2">
                            <p class="">cost: </p>
                            <p class="font-semibold px-4 text-end" v-if="displayFormula.estimatedCost">${{ Number((displayFormula.estimatedCost).toFixed(2)) }}</p>
                          </div>

                        </div>

                        
                    </div>
                </div>

                <div class="mt-1 px-6 pt-1 odd:bg-slate-300 rounded-md border-2 border-slate-400" v-for="phase, phaseKey in displayFormula.phases">
                    <div class="drop-zone w-full flex flex-row" 
                        :key="phaseKey"
                        :id="'phase-' + phaseKey"
                        @drop="onDropFormula($event, phase)"
                        @dragenter.prevent
                        @dragover.prevent
                    >
                        <div class="w-full flex flex-col">
                            <div class="flex flex-col w-full px-3 mb-4">
                                <div class=" rounded-sm w-full flex flex-row mb-2">
                                    <div class="w-2/6 flex flex-row">
                                        <div class="w-full px-2 font-semibold" @click="phase.updateIngredientOrderByName()">Ingredient</div>
                                        <div class="hidden w-1/2 font-semibold">Inci</div>
                                    </div>

                                    <div class="w-4/6 flex flex-row px-2 mr-10 justify-end gap-3">
                                        <div class="w-20 font-semibold" @click="phase.updateIngredientOrder()">Percentage</div>
                                        <div class="w-12 font-semibold">Amount</div>
                                        <div class="w-24 mr-5 ml-6 font-semibold" v-show="formulaUnit==='g'">$/kg</div>
                                        <div class="w-24 mr-5 ml-6 font-semibold" v-show="formulaUnit==='Oz'">$/Oz</div>
                                        <div class="w-8 font-semibold">Cost</div>
                                    </div>
                                </div>

                                <div 
                                    v-for="(ingredient, ingredientKey) in phase.ingredients" 
                                    
                                    :key="ingredientKey" 
                                    class="
                                    drag-el 
                                    flex flex-row 
                                    even:bg-slate-200 odd:bg-slate-300
                                    hover:cursor-grab active:cursor-grabbing hover:bg-slate-400
                                    " 
                                    draggable="true"
                                    @dragstart="startDragFormula($event, phaseKey, ingredientKey)"
                                >

                                    <label :for="'ingredient-'+ingredient.name" class="w-2/5 flex flex-row">
                                        <div class="w-full px-2">{{ ingredient.name }}</div>
                                        <div class="w-1/2 hidden font-thin italic">{{ ingredient.inci }}</div>
                                    </label>



                                    <div class="w-3/5 flex flex-row px-2 justify-end gap-1">

                                        <div class="flex flex-row w-20">
                                            <input 
                                            v-model.lazy="ingredient.percentage"
                                            v-on:blur="updateIngredientWeight(ingredient, phase)" 
                                            type="number" 
                                            name="percentage" 
                                            :id="'ingredient-'+ingredient.name"
                                            class="h-6 w-14"
                                            >
                                            <p>%</p>
                                                        
                                        </div>
                                        
                                        <div class="flex flex-row w-10 ">
                                            <p v-if="ingredient.percentage">{{ Number(ingredient.getWeight(formulaUnit)).toFixed(2) }}</p>
                                            <p class="">{{ formulaUnit }}</p>
                                        </div>
<!--TODO replace with common div that uses global Unit as input to getCost instead of hard coded, same for $/Unit-->
                                        <div class="flex flex-row w-24 mr-5 ml-6 " v-show="formulaUnit==='g'">
                                            
<!--                                            <input
                                            v-model.lazy="ingredient.cost"
                                            v-on:blur="updateFormulaCost()"
                                            type="number"
                                            name="ingredientCost"
                                            :id="'cost-ingredient-'+ingredient.name"
                                            class="h-6 w-16 appearance-none outline-none border p-2"
                                            >-->
                                            <p>{{ Number(ingredient.getCost('g')).toFixed(2) }} $/kg</p>
                                            
                                        </div>

                                        <div class="flex flex-row w-24 mr-5 ml-6" v-show="formulaUnit==='Oz'">
                                          <p>{{ Number(ingredient.getCost('Oz')).toFixed(2) }} $/Oz</p>
                                        </div>

                                        <div class="flex flex-row w-10 justify-end">
                                            <p v-if="ingredient.percentage">${{ Number((ingredient.getWeight('g') * ingredient.cost * 0.001 ).toFixed(2)) }}</p>
                                        </div>
                                      <font-awesome-icon @click="editIngredient(ingredient)" :icon="['fa', 'gears']" class="my-1 hover:cursor-pointer flex text-slate-600 hover:text-slate-500 text-md" />
<!--                                      todo : figure out how to add below icon and write down how so i know for next time -->
                                      <font-awesome-icon @click="phase.removeIngredientByIndex(ingredientKey)" :icon="['fa', 'circle-xmark']" class="my-1 hover:cursor-pointer flex hover:text-red-700 text-slate-600 text-md" />
                                    </div>

                                </div>
                            </div>
                            

                        <div class="flex flex-row justify-between">

                            <div class="flex flex-col w-1/2 pt-0">
                                <div class="flex-row">
                                    <button @click="deletePhase(phaseKey)" class="bg-slate-400 hover:bg-red-400 px-2 mx-2 rounded-md font-semibold w-16">Delete</button>
                                    <label :for="'phase-name-' + phaseKey" class="px-2">Phase:</label>
                                    <input :id="'phase-name-' + phaseKey" v-model="phase.name" />
                                    <label class="bg-slate-400 w-24 mx-2 px-2 text-center rounded-md font-semibold hover:cursor-pointer hover:bg-slate-300" :for="'phase-desc-' + phaseKey" @click="toggleDescShow(phaseKey)">Description </label>
                                </div>

                                <div  class="flex flex-col py-2">

                                    <div class="" v-show="showPhaseDescs.has(phaseKey)">
                                        <textarea 
                                            class="h-20 w-full"
                                            v-model="phase.description"
                                            placeholder="description" 
                                            :id="'phase-desc-' + phaseKey" 
                                            resize="none"
                                            rows="4" 
                                            cols="40"></textarea>
                                    </div>
                                    
                                </div>
                            </div>
                             <search-ingredient-box :phase-key="phaseKey" :phase="phase"/>
                        </div>


                        </div>
                    </div>
                </div>
                <div class="flex flex-row w-full justify-between mt-1">
                    <div class="flex flex-row justify-start">
                        <button @click="addPhase" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Add Phase</button>
                        <button @click="print(displayFormula)" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Print</button>

                    </div>
                    
                
                    <div v-if="displayFormula.saveStatus === 'new'" class="flex flex-row justify-end">
                        <button @click="submitFormula" 
                        class="
                            bg-slate-400 
                            px-2 
                            hover:bg-slate-300 
                            mx-2 
                            rounded-md 
                            font-semibold">Save</button>
                        <button @click="resetDisplayAndCachedFormula" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Reset</button>
                    </div>
                    <div v-else class="flex flex-row justify-end">
                        <button @click="submitFormula" 
                        class=" hidden
                            bg-slate-400 
                            px-2 
                            hover:bg-slate-300 
                            mx-2 
                            rounded-md 
                            font-semibold">Duplicate</button>
<!--                      todo replace these with recognisable icons up top after moving info to details below -->
                        <button @click="submitUpdateFormula" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Save</button>
                        <button @click="deleteFormula" class="bg-red-400 hover:bg-red-200 px-2 mx-2 rounded-md font-semibold">Delete</button>
                        <button @click="resetDisplayAndCachedFormula()" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">New Formula</button>
                        <button @click="toggleShowDetails()" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Details</button>
                    </div>

                </div>
              <formula-details v-if="showDetails" :formula="displayFormula" @close="toggleShowDetails" />
            </div>

          <edit-ingredient-component v-if="showEditWindow" :item="data.ingredientList.getHighlightIngredient()" :itemCopy="data.ingredientList.getHighlightIngredientCopy()" :ingredient-in-formulas="foundInFormulasList" @close="closeEditIngredientWindow"/>
        </div>
    </div>

   <formula-print-page :display-formula="displayFormula" :formula-unit="formulaUnit" />
</template>

<style>

</style>

