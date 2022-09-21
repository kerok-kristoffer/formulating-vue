<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from 'axios';
import Ingredient from "../types/Ingredient";
import Formula from "../types/Formula";
import Phase from "../types/Phase";
import Units from "../types/Units";

const ingredients = ref<Ingredient[]>([])
const formulaUnit = ref<Units>('g')
const formulaList = ref<Formula[]>([])
const newIngredient = ref(new Ingredient(0, 0, "", ""))
onMounted(async () => {
let {data} = await axios.get('users/ingredients?page_id=1&page_size=15');

for (let i in data) {
    let ing = data[i]
    let ingredient = new Ingredient(i, ing.Id, ing.Name, ing.Inci)
    ingredients.value.push(ingredient)
}

({data} = await axios.get('users/formulas?page_id=1&page_size=10'));

for (const i in data) {
    let formulaData = data[i]

    addToFormulaListFromApiData(formulaData)
}


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
    //formula.updateWeights(formulaUnit.value)
    formulaList.value.push(formula)
}

const getFormulaList = () => {
    return formulaList.value
}

const setDisplayFormula = (formula :Formula) => { // TODO: save "new" formulas as temporary? could load cached when pressing new formula button again?
    formula.saveStatus = 'edited'
    displayFormula.value = formula
}

let defaultEmptyPhases = [] as Phase[]
defaultEmptyPhases.push(new Phase(0, 'A', []))
defaultEmptyPhases.push(new Phase(0, 'B', []))
defaultEmptyPhases.push(new Phase(0, 'C', []))
const displayFormula = ref<Formula>(new Formula("Magic", defaultEmptyPhases, 100, 'new'))

const resetDisplayFormula = () => {
    defaultEmptyPhases = [] as Phase[]
    defaultEmptyPhases.push(new Phase(0, 'A', []))
    defaultEmptyPhases.push(new Phase(0, 'B', []))
    defaultEmptyPhases.push(new Phase(0, 'C', []))
    displayFormula.value = new Formula("Magic", defaultEmptyPhases, 100, 'new')
}


const onDropFormula = (event, phase :Phase) => {
        // todo: possible to transfer Ingredient object instead of strings?
    let ingredientListIndex = event.dataTransfer.getData('ingredientListIndex')
    let ingredientIndex = event.dataTransfer.getData('ingredientPhaseIndex')

    let ingredient = ingredients.value.find((i) => i.id == ingredientListIndex)
    console.log(ingredient)

    if(ingredient != undefined) {
        phase.addIngredient(new Ingredient(phase.ingredients.length, ingredient.ingredient_id, ingredient.name, ingredient.inci))
        return
    }

    const phaseName = event.dataTransfer.getData('phaseName')
    if(!phaseName) {
        console.log("no phase name")
        return
    }
    
    const phaseToRemoveFrom = displayFormula.value.phases.find((phase) => phase.name == phaseName)
    if (phaseToRemoveFrom === undefined) {
        console.log("Could not find phase: " + phaseName)
    } else {
        
        let ingredient = phaseToRemoveFrom.removeIngredientByIndex(ingredientIndex)
        phase.addIngredient(ingredient)
    }
    
}

const getIngredientList = () :Ingredient[] => {
    return ingredients.value
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
        console.log("phase %s not found in onDrop()", phaseName)
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
}

const updateIngredientWeight = (ingredient :Ingredient, phase :Phase) :void => {
    let ingredientWeight = displayFormula.value.getWeight(formulaUnit.value) * ingredient.percentage * 0.01
    ingredient.setWeight(ingredientWeight, formulaUnit.value)
    
    phase.updateIngredientOrder()
    displayFormula.value.updateWeights(formulaUnit.value)
}

const submitFormula = () => {
    axios.post("users/formulas", displayFormula.value).then(response => {
        addToFormulaListFromApiData(response.data)
        displayFormula.value.saveStatus = 'saved'
        resetDisplayFormula()
        })
}

const submitUpdateFormula = () => {
    let url = "users/formulas/" + displayFormula.value.id
    axios.post(url, displayFormula.value).then(response => {
        console.log(response.data)
        displayFormula.value.saveStatus = 'saved'
        resetDisplayFormula()
        })
        // TODO kerok: add error messages for faulty inputs in fron-end, ie 0g for updateFormula
}

const submitIngredient = (ingredient :Ingredient) => {

    axios.post('users/ingredients', ingredient).then(response => {
        let ing = response.data
        console.log(ing)
        ingredients.value.push(new Ingredient(ingredients.value.length, Number(ing.Id), ing.Name, ing.Inci))
    });
}


</script> 

<template>
    <div class="container">
    
        <div id="formula-list">
            <h2>Formulas</h2>

            <ul v-for="formula in getFormulaList()">
                <li v-bind:class="'status_' + formula.saveStatus" @click="setDisplayFormula(formula)">{{ formula.name }}</li>
            </ul>
        </div>
        <div id="formula-box">
            <h2>Formula</h2>

            <div class="row">
                <div>
                    <p>
                        <label for="formula-name">name: </label>
                        <input type="text" name="formula-name" id="formula-name" v-model="displayFormula.name">
                    </p>
                    <p v-show="formulaUnit==='g'">
                        <label for="formula-weight">amount: </label>
                        <input 
                        type="number" 
                        name="formula-weight" 
                        id="formula-weight" 
                        v-model="displayFormula.totalWeight" 
                        v-on:blur="weightUpdate(displayFormula)"> 
                        <button @click="toggleMeasurement">{{ formulaUnit }}</button>
                    </p>
                    <p v-show="formulaUnit==='Oz'">
                        <label for="formula-weight">amount: </label>
                        <input 
                        type="number" 
                        name="formula-weight" 
                        id="formula-weight" 
                        v-model="displayFormula.totalWeightInOunces"
                        v-on:blur="weightUpdate(displayFormula)"> 
                        <button @click="toggleMeasurement">{{ formulaUnit }}</button>
                    </p>
                </div>  
                <div>
                    <p>
                        description: 
                    </p>
                    <textarea 
                        v-model="displayFormula.description" 
                        rows="20" 
                        cols="50"
                        class="textarea" 
                        name="description" 
                        id="formula-description" />

                </div>  
            </div>
            

            <div v-for="phase, phaseKey in displayFormula.phases">
                <div class="drop-zone" 
                    :key="phaseKey"
                    :id="'phase-' + phaseKey"
                    @drop="onDropFormula($event, phase)"
                    @dragenter.prevent
                    @dragover.prevent
                >
                    Phase:<input v-model="phase.name" />
                    <div 
                        v-for="(ingredient, key) in phase.ingredients" 
                        
                        :key="key" 
                        class="drag-el formula-item" 
                        draggable="true"
                        @dragstart="startDragFormula($event, phase.name, key)"
                    >

                        <label :for="'ingredient-'+ingredient.name">{{ ingredient.name }}: "{{ ingredient.inci }}"</label>
                        <p class="row percentage-input">
                            <input v-model.lazy="ingredient.percentage" v-on:blur="updateIngredientWeight(ingredient, phase)" type="number" name="percentage" :id="'ingredient-'+ingredient.name">
                            %                            
                        </p>
                        
                        <p v-if="ingredient.percentage" class="row">
                            {{ Number(ingredient.getWeight(formulaUnit).toFixed(2)) }}{{ formulaUnit }}
                        </p>

                    </div>
                    <div>
                        <p><label class="description-label" :for="'phase-' + phaseKey">description:</label></p>
                        <textarea v-model="phase.description" :id="'phase-' + phaseKey" rows="4" cols="50"></textarea>
                    </div>
                </div>
                
            </div>
            <p>remaining: {{ displayFormula.getAllocatedPercentagesRemaining() }}%</p>

            <div v-if="displayFormula.saveStatus === 'new'">
                <button @click="submitFormula">Submit</button>
            </div>
            <div v-else>
                <button @click="submitUpdateFormula">Update</button>
                <button @click="resetDisplayFormula">New Formula</button>
            </div>
            

        </div>


        <div id="ingredient-list">
            <div class="drop-zone"  
                @drop="onDrop($event)"
                @dragenter.prevent
                @dragover.prevent
            >
                <h2>Ingredients</h2>

                <div 
                    v-for="item in getIngredientList()" 
                    :key="item.id" 
                    class="drag-el"
                    draggable="true"
                    @dragstart="startDrag($event, item.id)"
                >
                    {{ item.name }}, {{ item.inci}}
                </div>
            </div>
            <div>
                <input
                    placeholder="new ingredient"
                    v-model="newIngredient.name"
                    type="text"
                    name="Name"
                    />
                <input v-model="newIngredient.inci" placeholder="INCI" type="text" name="Inci" />

                <button value="Add" @click="submitIngredient(newIngredient)">Add</button>
            </div>
        </div>

    </div>
</template>

<style>

.container {
    display: flex;
    justify-content: space-around;
    gap: 50px;
}

.drop-zone {
    width: 100%;
    margin: 20px auto;
    background-color: #ecf0f1;
    padding: 10px;
    min-height: 10px;
}

.drag-el {
    background-color: #3498db;
    color: white;
    padding: 5px;
    margin-bottom: 10px;
}

.drag-el:nth-last-of-type() {
    margin-bottom: 0;
}

#formula-box {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#formula-list {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#ingredient-list {
    width: 30%;
}

.row {
    display: flex;
}

.formula {
    background-color: aliceblue;
}

.formula-item {
    display: flex;
    justify-content: space-between;
    place-items: center;
}

.status_edited {
    text-decoration: line-through;
}

.formula-item:p {
    max-width: 50px;
}

textarea {
    resize: none;
    width: 20rem;
    height: 5rem;
}

#formula-weight {
    width: 5rem;
}

</style>

