<template>

    <h1 class="text-3xl mb-6">Ingredients</h1>
<!--todo, question for PO, what would you want to see at the mobile view for ingredients?-->
    <div class="flex flex-col mb-12 px-0 md:pt-0 w-full pb-3">
      <div class="flex flex-row mb-6 md:px-4 w-full pb-3">
          <ul class="flex flex-col w-full text-left text-xl md:text-sm">
              <li class="flex w-full h-9 md:h-5 pt-1 bg-slate-200 dark:bg-slate-700">
                <p class="w-9/12 md:w-5/12 font-bold">Name</p>
                <p class="hidden md:block w-5/12 md:w-4/12 font-bold">Inci</p>
                <p class="w-4/12 md:w-1/12 font-bold">Cost ($/kg)</p>
                <p class="hidden md:block w-1/12 font-bold">Tags</p>
              </li>

              <li class="w-full h-9 md:h-5 pt-1 md:pt-0 even:bg-slate-100 odd:bg-slate-200 hover:bg-slate-300 dark:even:bg-slate-500 dark:odd:bg-slate-700 dark:hover:bg-slate-600" v-for="ingredient in ingredients">
                <div class="w-full flex flex-row">
                  <div @click="editIngredient(ingredient)" class="w-full flex flex-row hover:cursor-pointer">
                        <p class="font-bold w-9/12 md:w-5/12 whitespace-no-wrap" >{{ingredient.name}}</p>
                        <p class="font-thin italic hidden md:block w-4/12 whitespace-no-wrap">{{ingredient.inci}}</p>
                        <p class="font-thin italic w-1/12">{{ingredient.cost}}</p>
                        <p class="w-1/12 hidden md:flex flex-row justify-items-start" >
                          <div v-for="tag in ingredient.tags" class="mx-0.5">
                            <span class="
                            h-5 
                            font-extralight
                            float-left 
                            mr-0 
                            bg-slate-300
                            rounded-md 
                            px-1 
                            py-0">{{tag.name}}</span>
                          </div>
                        </p>
<!--                    <i class="fa-solid fa-file-circle-exclamation" style="color: #64748b;"></i>-->
                      </div>
                  <p v-if="isPartOfFormula(ingredient)" ><font-awesome-icon :icon="['fas', 'fa-file-circle-exclamation']" class="text-slate-400"/></p>
<!--                  <p v-if="false" ><font-awesome-icon :icon="['fas', 'fa-file-circle-exclamation']" style="color: #64748b;" /></p>-->
                  <button v-else class="border-solid border-slate-500 rounded-md hover:bg-slate-400 px-1.5" @click="deleteIngredient(ingredient)">X</button>
                </div>

              </li>
          </ul>

      </div>
      <button-standard :text="'Add Ingredient'" @click="addIngredientClick" />

    <edit-ingredient-component v-if="showEditWindow" :item="data.ingredientList.getHighlightIngredient()" :itemCopy="selectedItemCopy" :ingredient-in-formulas="foundInFormulasList" @close="closeEditWindow" @refresh="refreshInFormulaList" />
    <add-ingredient-component v-if="showAddWindow" :item="newIngredient" @cancel="cancelAdd" @updateItem="addIngredient"/>
  </div>


    
</template>
    
<script setup lang="ts">
import { onMounted, ref } from "vue";

import Ingredient from "../types/Ingredient";
import EditIngredientComponent from "./EditIngredientComponent.vue";
import ButtonStandard from "./ButtonStandard.vue";
import AddIngredientComponent from "./AddIngredientComponent.vue";
import {useAccountStore} from "../stores/account";

import {userData} from "../stores/userData";
import Formula from "../types/Formula";

const data = userData()
const editing = ref(-1)
const newIngredient = new Ingredient(0,0,"new ingredient", "", null, [])
const ingredients = ref<Ingredient[]>(data.ingredientList.ingredients)
const showEditWindow = ref(false);

let api = data.api;
const showAddWindow = ref(false);
const selectedItem = ref<Ingredient>(newIngredient)
const selectedItemCopy = ref<Ingredient>(newIngredient)
const accountStore = useAccountStore();
let foundInFormulasList = ref<Formula[]>([]);

const editIngredient = (ingredient :Ingredient) => {
  data.ingredientList.setHighlightIngredient(ingredient);
  data.ingredientList.setHighlightIndex(data.ingredientList.ingredients.indexOf(ingredient))
  selectedItem.value = data.ingredientList.getHighlightIngredient(); // TODO safe to delete after moving functionality to ingredientList?
  selectedItemCopy.value = data.ingredientList.getHighlightIngredientCopy();
  foundInFormulasList.value = inFormulas(ingredient);
  showEditWindow.value = true;
}
// TODO move this to ingredientList
function inFormulas(ingredient :Ingredient) :Formula[] {

  let filter = formulas.filter((formula) => {
    return formula.hasIngredient(ingredient);
  });
  return filter;
}

let formulas = data.formulaList.formulas;

function isPartOfFormula(ingredient :Ingredient) :boolean {

  for (let i = 0; i < formulas.length; i++) {
    if(formulas[i].hasIngredient(ingredient)) {
      return true;
    }
  }
  return false;

}

function refreshInFormulaList() {
  foundInFormulasList.value = inFormulas(data.ingredientList.getHighlightIngredient());
}

function closeEditWindow() {
  showEditWindow.value = false;
}

const onUpdateItem = (ingredient :Ingredient) => {
  // ingredients.value[editing.value] = item; // ?
  console.log("updating ing:" + ingredient.name);

  //api.getIngredientService().updateIngredient(ingredient).then(response => {
  showEditWindow.value = false;
}

function restoreEditItem() {
  data.ingredientList.setHighlightIngredient(data.ingredientList.getHighlightIngredientCopy());
  //selectedItem.value = data.ingredientList.getHighlightIngredient();
}

const cancelUpdate = () => {
  showEditWindow.value = false;
}
const cancelAdd = () => {
  showAddWindow.value = false;
}

const getIngredients = () => {
  ingredients.value = data.ingredientList.ingredients
}

onMounted(async () => {
  if(accountStore.cachedIngredients.length == 0) {
    getIngredients()

  } else {
    ingredients.value = accountStore.cachedIngredients;
  }

});

async function refreshIngredients() {
  await data.refreshIngredientList()
  await data.ingredientList.populateWithTags()
  ingredients.value = data.ingredientList.ingredients
}

const deleteIngredient = (ingredient :Ingredient) => {
  data.ingredientList.removeIngredient(ingredient);
  api.getIngredientService().deleteIngredient(ingredient).then( (response) => {
    console.log(response.status)
  })
}

function addIngredientClick() {
  showAddWindow.value = true;
}

async function addIngredient(ingredient :Ingredient)  {
  api.getIngredientService().createIngredient(ingredient).then(response => {
    console.log(response);
  });
  showAddWindow.value = false;

  await refreshIngredients();
  console.log("refreshed ingredient list!")
}


</script>