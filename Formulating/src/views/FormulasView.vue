<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from 'axios';
import Ingredient from "../types/Ingredient";
import Formula from "../types/Formula";
import Phase from "../types/Phase";
import Units from "../types/Units";
import Tag from "../types/Tag";
import { useAccountStore } from "../stores/account";

const ingredients = ref<Ingredient[]>([])
const formulaUnit = ref<Units>('g')
const formulaList = ref<Formula[]>([])
const newIngredient = ref(new Ingredient(0, 0, "", "", 0, []))
const ingInput = ref<any>(null)
const accountStore = useAccountStore()
const tags = ref<Tag[]>([])
const tagFilters = ref<Tag[]>([])
const filteredIngredients = ref<Ingredient[]>([])

onMounted(async () => {

    axios.get('users/ingredients?page_id=1&page_size=50').then((response) => {
      let data = response.data
      let tagNames = new Set()
        for (let i in data) {
          let ing = data[i]
          let ingredient = new Ingredient(Number(i), ing.Id, ing.Name, ing.Inci, ing.cost, ing.tags)
          ingredients.value.push(ingredient)

          for (const i in ing.tags) {
              let tag = ing.tags[i]

              if(!tagNames.has(tag.name)) {
                  tagNames.add(tag.name)
                  tags.value.push(tag)
                  
              } else {
                ing.tags[i] = tags.value.find((t) => {return t.name == tag.name})
              }
          }
          tags.value.sort((t1, t2) => {return  t1.name > t2.name ? 1 : -1 });
        }
    });

    axios.get('users/formulas?page_id=1&page_size=20').then((response) => {
        let data = response.data

        for (const i in data) {
            let formulaData = data[i]
            addToFormulaListFromApiData(formulaData)
        }
    });

    filteredIngredients.value = ingredients.value

    
});

const addToFormulaListFromApiData = (formulaData :Formula) => {
    // Can these be cast to Formulas without all of this looping through individual sub components?
    let formulaPhases = [] as Phase[];
    for (let j in formulaData.phases) {
        let phase = formulaData.phases[j]
        let phaseIngredients = [] as Ingredient[]; 

        for (let k in phase.ingredients) {
            let phaseIngredient = phase.ingredients[k]
            let newIngredient = new Ingredient(
                phaseIngredient.id, 
                phaseIngredient.ingredient_id,
                phaseIngredient.name, 
                phaseIngredient.inci,
                Number(phaseIngredient.cost),
                []
                )
            newIngredient.percentage = phaseIngredient.percentage
            newIngredient.setWeight(phaseIngredient.weightInGrams, 'g')
            phaseIngredients.push(newIngredient)
        }
        
        let storedPhase = new Phase(phase.id, phase.name, phaseIngredients)
        storedPhase.description = phase.description

        formulaPhases.push(storedPhase)
    }
    
    let formula = new Formula(formulaData.name, formulaPhases, formulaData.totalWeight, 'saved')
    formula.description = formulaData.description
    formula.id = formulaData.id
    formulaList.value.push(formula)
}

const getFormulaList = () => {
    return formulaList.value
}

const setDisplayFormula = (formula :Formula) => { // TODO: save "new" formulas as temporary? could load cached when pressing new formula button again?
    formula.saveStatus = 'edited'
    displayFormula.value = formula
    displayFormula.value.updateCost()
}

const toggleFilter = (tag :Tag)  => {
    if(tag.isActive) {
        removeFilter(tag)
        tag.isActive = false
    } else {
        tagFilters.value.push(tag)
        tag.isActive = true
    }
    filterIngredientList()
}

const removeFilter = (tag :Tag) => {
    for (const i in tagFilters.value) {
        if(tagFilters.value[i].name == tag.name) {
            tagFilters.value.splice(Number(i), 1)
        }
    }
}

const hasActiveTag = (ingredient :Ingredient, index, array) => {
    for (const i in ingredient.tags) {
        let tag = ingredient.tags[i]
        if (tag.isActive) {
            return true
        }
    }
    return false
}

const filterIngredientList = () => {
    filteredIngredients.value = ingredients.value.filter(hasActiveTag)
    if (filteredIngredients.value.length == 0) {
        filteredIngredients.value = ingredients.value
    }
}


let defaultEmptyPhases = [] as Phase[]
defaultEmptyPhases.push(new Phase(0, 'A', []))

const displayFormula = ref<Formula>(new Formula("", defaultEmptyPhases, 100, 'new'))
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
        displayFormula.value = new Formula("", defaultEmptyPhases, 100, 'new')
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

    const fromPhaseName = event.dataTransfer.getData('phaseName')
    if(fromPhaseName) {
        ingredientDropFromPhase(ingredientIndex, fromPhaseName, dropPhase)
    } else {
        ingredientDropFromIngredientList(ingredientListIndex, dropPhase)
    }
}

const ingredientDropFromIngredientList = (ingredientListIndex :number, dropPhase :Phase) => {
    let ingredient = ingredients.value.find((i) => i.id == ingredientListIndex)

    if(ingredient != undefined) {
        console.log(ingredient)
        console.log(ingredientListIndex)
        dropPhase.addIngredient(new Ingredient(dropPhase.ingredients.length, ingredient.ingredient_id, ingredient.name, ingredient.inci, Number(ingredient.cost), []))
        return
    }
}

const ingredientDropFromPhase = (ingredientIndex :number, fromPhaseName :string, dropPhase :Phase) => {
        
    const phaseToRemoveFrom = displayFormula.value.phases.find((phase) => phase.name == fromPhaseName)
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

const startDragFormula = (event, phaseName: string, ingredientIndex: number | string) => {
    event.dataTransfer.dropEffect = 'copy'
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('phaseName', phaseName)
    event.dataTransfer.setData('ingredientPhaseIndex', ingredientIndex)
}

const onDrop = (event) => {
    
    const ingredientId = event.dataTransfer.getData('ingredientPhaseIndex')
    const phaseName = event.dataTransfer.getData('phaseName')
    const phase = displayFormula.value.phases.find((phase) => phase.name == phaseName)
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
    console.log(displayFormula.value.estimatedCost)
    console.log(displayFormula)
    displayFormula.value.updateCost()
}

const submitFormula = () => {
    axios.post("users/formulas", displayFormula.value).then(response => {
        if(response.status === 200) {
            addToFormulaListFromApiData(response.data)
            displayFormula.value.saveStatus = 'saved'
            resetDisplayAndCachedFormula()
        }
    })
}

const submitUpdateFormula = () => {
    let url = "users/formulas/" + displayFormula.value.id
    axios.post(url, displayFormula.value).then(response => {
        displayFormula.value.saveStatus = 'saved'
        resetDisplayFormula()
        })
        // TODO kerok: add error messages for faulty inputs in fron-end, ie 0g for updateFormula
}

const submitIngredient = (ingredient :Ingredient) => {

    axios.post('users/ingredients', ingredient).then(response => {
        if (response.status !== 200) {
            return
        }
        let ing = response.data
        ingredients.value.push(new Ingredient(ingredients.value.length, Number(ing.Id), ing.Name, ing.Inci, ing.cost, []))
        newIngredient.value = new Ingredient(0, 0, "", "", 0, [])
        ingInput.value.focus()
    });
}

const orderByPercentage = (phase :Phase) => {
    phase.updateIngredientOrder()
}


</script> 

<template>
    <main class="w-5/6 mx-auto py-6 pb-24 bg-slate-100 flex flex-row">
    
        <div id="formula-list" class="w-1/6 px-2"> <!-- todo: add filtering on formula tags -->
            <h2 class="py-1 bg-slate-300 font-bold rounded-t-md text-center">Formulas</h2>

            <ul class="px-2 py-1 even:bg-slate-100 odd:bg-slate-200 hover:bg-slate-300" v-for="formula in getFormulaList()">
                <li v-bind:class="'status_' + formula.saveStatus" @click="setDisplayFormula(formula)">{{ formula.name }}</li>
            </ul>
        </div>

        <div id="formula-box" class="w-4/6 flex flex-col mx-6 p-6 rounded-lg bg-slate-200">
            <h2 class="font-bold text-lg text-center pb-3">Formula</h2>

            <div class="flex flex-row h-24">
                <div class="flex flex-col">
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
                            v-model="displayFormula.name">
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
                        <p class="w-2/3 font-semibold px-4">{{ displayFormula.getAllocatedPercentagesRemaining() }}%</p>
                    </div>
                    <div class="flex flex-row px-2">
                        <p class="w-1/3">cost: </p> 
                        <p class="w-2/3 font-semibold px-4">${{ displayFormula.estimatedCost }}</p>
                    </div>
                    
                </div>  
                <div class="flex flex-col">
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
            </div>
            

            <div class="my-3 p-6 odd:bg-slate-300 rounded-md" v-for="phase, phaseKey in displayFormula.phases">
                <div class="drop-zone w-full flex flex-row" 
                    :key="phaseKey"
                    :id="'phase-' + phaseKey"
                    @drop="onDropFormula($event, phase)"
                    @dragenter.prevent
                    @dragover.prevent
                >
                    <div class="flex flex-col w-1/3">
                        <div class="flex-row">
                            <label :for="'phase-name-' + phaseKey" class="px-2">Phase:</label>
                            <input :id="'phase-name-' + phaseKey" v-model="phase.name" />
                        </div>

                        <div class="flex flex-col py-2">
                            
                            <textarea 
                                class="h-20"
                                v-model="phase.description"
                                placeholder="description" 
                                :id="'phase-' + phaseKey" 
                                resize="none"
                                rows="4" 
                                cols="40"></textarea>
                        </div>

                        <button @click="deletePhase(phaseKey)" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold w-16">Delete</button>
                    </div>
                    
                    <div class="flex flex-col w-2/3 px-3">
                        <button @click="orderByPercentage(phase)" class="bg-slate-400 rounded-sm mx-4 my-2">sort</button>
                        <div class=" rounded-sm flex flex-row">
                            <div class="w-2/5 flex flex-row">
                                <div class="w-1/2 px-2 font-semibold">Name</div>
                                <div class="w-1/2 font-semibold">Inci</div>
                            </div>

                            <div class="w-3/5 flex flex-row px-2 justify-end gap-2">
                                <div class="w-20 font-semibold">Percentage</div>
                                <div class="w-12 font-semibold">Amount</div>
                                <div class="w-24 mr-5 ml-6 font-semibold">$/kg</div>
                                <div class="w-8 font-semibold">Cost</div>
                            </div>
                        </div>

                        <div 
                            v-for="(ingredient, key) in phase.ingredients" 
                            
                            :key="key" 
                            class="
                            drag-el 
                            flex flex-row 
                            even:bg-slate-200 odd:bg-slate-300
                            hover:cursor-grab active:cursor-grabbing
                            " 
                            draggable="true"
                            @dragstart="startDragFormula($event, phase.name, key)"
                        >

                            <label :for="'ingredient-'+ingredient.name" class="w-2/5 flex flex-row">
                                <div class="w-1/2 px-2 font-semibold">{{ ingredient.name }}</div>
                                <div class="w-1/2 font-thin italic">{{ ingredient.inci }}</div>
                            </label>



                            <div class="w-3/5 flex flex-row px-2 justify-end gap-2">

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
                                    <p v-if="ingredient.percentage">{{ Number(ingredient.getWeight(formulaUnit).toFixed(2)) }}</p>
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
                                    <p v-if="ingredient.percentage">{{ Number((ingredient.getWeight(formulaUnit) * ingredient.cost * 0.001 ).toFixed(2)) }}</p>
                                    <p class="">$</p>
                                </div>
                            </div>
                            

                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row w-full justify-between">
                <div class="flex flex-row justify-start">
                    <button @click="addPhase" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Add Phase</button>
                </div>
                
            
                <div v-if="displayFormula.saveStatus === 'new'" class="flex flex-row justify-end">
                    <button @click="submitFormula" 
                    class="
                        bg-slate-400 
                        px-2 
                        hover:bg-slate-300 
                        mx-2 
                        rounded-md 
                        font-semibold">Submit</button>
                    <button @click="resetDisplayAndCachedFormula" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Reset</button>
                </div>
                <div v-else class="flex flex-row justify-end">
                    <button @click="submitUpdateFormula" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">Update</button>
                    <button @click="resetDisplayFormula" class="bg-slate-400 hover:bg-slate-300 px-2 mx-2 rounded-md font-semibold">New Formula</button>
                </div>
            </div>
        </div>


        <div id="ingredient-list" class="w-1/6 pr-2">
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

            <p class="py-1 mb-2 bg-slate-300 font-semibold rounded-t-md text-center">Filters</p>
            <p></p>
            <div class="w-full">
                <div class="flex flex-row flex-wrap justify-items-start h-14 pr-2">
                    <ul v-for="tag, index in tags" :key="tag.id" class="">
                        <li @click="toggleFilter(tag)"
                                class="
                                    h-5 
                                    font-extralight
                                    float-left 
                                    mr-1 
                                    bg-slate-300
                                    hover:bg-slate-400
                                    hover:cursor-pointer
                                    rounded-md 
                                    px-1 
                                    my-0.5
                                    py-0"
                                    :class=" tag.isActive ? 'bg-slate-400' : 'bg-slate-300'">
                            {{ tag.name }}
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    </main>
</template>

<style>

</style>

