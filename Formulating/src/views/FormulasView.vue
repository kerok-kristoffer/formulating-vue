<script setup lang="ts">
import { onMounted, ref } from "vue";
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

const ingredients = ref<Ingredient[]>([])
const formulaUnit = ref<Units>('g')
const formulaList = ref<Formula[]>([])
const newIngredient = ref(new Ingredient(0, 0, "", "", 0, []))
const ingInput = ref<any>(null)
const accountStore = useAccountStore()
const tags = ref<Tag[]>([])
const tagFilters = ref<Tag[]>([])
const filteredIngredients = ref<Ingredient[]>([])
const showPhaseDescs = ref(new Set())
const ingredientSearchInput = ref('')
const data = userData()
let ingredientList = null;

onMounted(async () => {
  ingredientList = data.ingredientList;
  ingredients.value = ingredientList.ingredients;
  tags.value = ingredientList.tags;
  filteredIngredients.value = ingredients.value

  formulaList.value = data.formulaList.formulas

});



const getFormulaList = () => {
    return formulaList.value
}

const setDisplayFormula = (formula :Formula) => { // TODO: save "new" formulas as temporary? could load cached when pressing new formula button again?
    formula.saveStatus = 'edited'
    displayFormula.value = formula
    displayFormula.value.updateCost()
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
}
accountStore.setCachedFormula(displayFormula.value)

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

const toggleMeasurement = () :void => {
    if (formulaUnit.value === 'g') {
        formulaUnit.value = 'Oz'
    } else if (formulaUnit.value === 'Oz') {
        formulaUnit.value = 'g'
    }
}

const weightUpdate = (formula :Formula) :void => {
    formula.updateWeights(formulaUnit.value)
    formula.updateCost()
}

const updateIngredientWeight = (ingredient :Ingredient, phase :Phase) :void => {
    let ingredientWeight = displayFormula.value.getWeight(formulaUnit.value) * ingredient.percentage * 0.01
    ingredient.setWeight(ingredientWeight, formulaUnit.value)
    
    displayFormula.value.updateWeights(formulaUnit.value)
    displayFormula.value.updateCost()
}

const updateFormulaCost = () => {
    displayFormula.value.updateCost()
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
    // TODO kerok: add error messages for faulty inputs in fron-end, ie 0g for updateFormula
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


</script> 

<template>
    <div class="md:hidden w-full bg-slate-100">
      <p class="text-xl text-center">
        {{displayFormula.name}}
      </p>

      <ul v-for="phase, phaseKey in displayFormula.phases" class="flex flex-col">
        <li class="w-full flex flex-col"
             :key="phaseKey"
             :id="'phase-' + phaseKey"
        >
          <div class="text-lg">{{phase.name}}</div>
          <ul v-for="ing in phase.ingredients" class="flex flex-col ml-2">
            <li class="flex flex-row">
              <div class="w-8/12">
                {{ ing.name }}
              </div>
              <div class="w-2/12 text-xs">
                {{ing.percentage}} %
              </div>
              <div class="w-2/12 text-xs ">${{Number((ing.getWeight('g') * ing.cost * 0.001 ).toFixed(2)) }}</div>
            </li>

          </ul>
        </li>
      </ul>
      <div class="flex flex-row justify-end w-full text-lg">
        <div class="w-8/12"></div>
        <div class="w-2/12">{{100 - displayFormula.getAllocatedPercentagesRemaining()}}%</div>
        <div class="mr-10">${{Number(displayFormula.estimatedCost).toFixed(2)}}</div>
      </div>
    </div>
    <div class="md:w-5/6 mx-auto py-6 pb-24 bg-slate-100 hidden md:flex flex-col">
        
        <div class="flex flex-row">

          <formula-list @clickFormula="setDisplayFormula"/>
            <div id="formula-box" class="w-4/6 flex md:flex flex-col md:mx-6 p-6 rounded-lg bg-slate-200">

                <h2 v-if="displayFormula.name" class="font-bold text-lg text-center pb-3">{{displayFormula.name}}</h2>
                <div class="flex flex-row h-24">
                    <div class="flex flex-col w-1/4">
                        <div class="flex flex-row px-2">
                            <div class="w-1/3">
                                <label for="formula-name w-1/3">name: </label>
                            </div>
                            <div class="w-2/3">
                                <input type="text" 
                                placeholder="New Formula"
                                class="h-6 w-full" 
                                name="formula-name" 
                                id="formula-name" 
                                v-model.lazy="displayFormula.name">
                            </div>
                            
                        </div>
                        <div class="flex flex-row px-2" v-show="formulaUnit==='g'">
                            <div class="w-1/3">
                                <label for="formula-weight" class="text-left">amount: </label>
                            </div>
                            <div class="w-2/3">
                                <input 
                                type="number" 
                                name="formula-weight" 
                                id="formula-weight"
                                class="h-6 w-2/3"
                                v-model="displayFormula.totalWeight" 
                                v-on:blur="weightUpdate(displayFormula)"> 
                                <button @click="toggleMeasurement" class="bg-slate-300 mx-1 px-2 rounded-sm hover:bg-slate-200">{{ formulaUnit }}</button>
                            </div>
                        </div>
                        <div class="flex flex-row px-2" v-show="formulaUnit==='Oz'">
                            <div class="w-1/3">
                                <label for="formula-weight" class="text-left">amount: </label>
                            </div>
                            <div class="w-2/3">
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
                            <p class="w-1/3">remaining: </p> 
                            <p class="w-1/3 font-semibold px-4 text-end">{{ displayFormula.getAllocatedPercentagesRemaining() }}%</p>
                        </div>
                        <div class="flex flex-row px-2">
                            <p class="w-1/3">cost: </p> 
                            <p class="w-1/3 font-semibold px-4 text-end" v-if="displayFormula.estimatedCost">${{ Number((displayFormula.estimatedCost).toFixed(2)) }}</p>
                        </div>
                        
                    </div>  
                    <div class="flex flex-col w-2/4">
                        <textarea 
                            v-model="displayFormula.description" 
                            rows="20" 
                            cols="50"
                            resize="none"
                            name="description" 
                            id="formula-description"
                            class="textarea" 
                            placeholder="description"
                            
                        />
                    </div> 
                    <div class="flex flex-col  w-1/4 m-2">
                        <p v-if="displayFormula.created_at">
                            First created: {{ displayFormula.created_at}}
                        </p>
                        <p v-if="displayFormula.updated_at">
                            Last updated: {{ displayFormula.updated_at}}
                        </p>
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
                                    <div class="w-2/5 flex flex-row">
                                        <div class="w-full px-2 font-semibold" @click="phase.updateIngredientOrderByName()">Ingredient</div>
                                        <div class="hidden w-1/2 font-semibold">Inci</div>
                                    </div>

                                    <div class="w-3/5 flex flex-row px-2 justify-end gap-1">
                                        <div class="w-20 font-semibold" @click="phase.updateIngredientOrder()">Percentage</div>
                                        <div class="w-12 font-semibold">Amount</div>
                                        <div class="w-24 mr-5 ml-6 font-semibold">$/kg</div>
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

                                        <div class="flex flex-row w-24 mr-5 ml-6">
                                            
                                            <input 
                                            v-model.lazy="ingredient.cost"
                                            v-on:blur="updateFormulaCost()" 
                                            type="number" 
                                            name="ingredientCost" 
                                            :id="'cost-ingredient-'+ingredient.name"
                                            class="h-6 w-16 appearance-none outline-none border p-2"
                                            >
                                            <p>$/kg</p>
                                            
                                        </div>
                                        
                                        <div class="flex flex-row w-10 justify-end">
                                            <p v-if="ingredient.percentage">${{ Number((ingredient.getWeight('g') * ingredient.cost * 0.001 ).toFixed(2)) }}</p>
                                        </div>
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
                        <button @click="submitUpdateFormula" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Save</button>
                        <button @click="deleteFormula" class="bg-red-400 hover:bg-red-200 px-2 mx-2 rounded-md font-semibold">Delete</button>
                        <button @click="resetDisplayAndCachedFormula()" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">New Formula</button>
                    </div>
                </div>
            </div>

            <div id="ingredient-list" class="w-1/6 pr-2 hidden md:block">
                <div class="drop-zone"  
                    @drop="onDrop($event)"
                    @dragenter.prevent
                    @dragover.prevent
                >

                    <h2 class="py-1 bg-slate-300 font-bold rounded-t-md text-center">Ingredients</h2>
                    <div class="h-128 overflow-y-auto">
                        <ul 
                            v-for="item in filteredIngredients" 
                            :key="item.id" 
                            class="drag-el 
                            px-2 py-1 
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

                <div class="flex flex-row w-full h-6 my-3">
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

                <FilterBox v-if="tags" :tags="tags" @toggleFilter="toggleFilter"/>

                <div v-if="displayFormula.getInciList().length >0" 
                class="py-2 my-2 bg-slate-200 font-semibold rounded-md text-center">
                
                    <span v-for="inci in displayFormula.getInciList()">
                        {{ inci }}, 
                    </span>
                
                </div>
                
            </div>

        </div>
    </div>
   <formula-print-page :display-formula="displayFormula" :formula-unit="formulaUnit" />
</template>

<style>

</style>

