<template>

    <h1 class="text-3xl mb-6">Ingredients</h1>
    <div class="flex flex-col mb-12 px-0 md:pt-0 w-full pb-3">
      <div class="flex flex-row mb-6 md:px-4 w-full pb-3">
          <ul class="flex flex-col w-full text-left text-xl md:text-sm">
              <li class="flex w-full h-9 md:h-5 pt-1 bg-slate-200">
                <p class="w-9/12 md:w-4/12 font-bold">Name</p>
                <p class="hidden md:block w-5/12 md:w-3/12 font-bold">Inci</p>
                <p v-if="userData().settings.preferredUnits == 'g'" class="w-4/12 md:w-2/12 font-bold">Cost </p>
                <p v-else-if="userData().settings.preferredUnits == 'Oz'" class="w-4/12 md:w-2/12 font-bold">Cost</p>
                <p class="hidden md:block w-3/12 font-bold">Tags</p>
              </li>

              <li v-if="data.ingredientList.ingredients"  class="w-full h-9 md:h-5 pt-1 md:pt-0 even:bg-slate-100 odd:bg-slate-200 hover:bg-slate-300" v-for="ingredient in data.ingredientList.ingredients">
                <div class="w-full flex flex-row">
                  <div @click="editIngredient(ingredient)" class="w-11/12 ml-0.5 flex flex-row hover:cursor-pointer">
                        <p class="font-bold w-9/12 md:w-4/12 whitespace-no-wrap" >{{ingredient.name}}</p>
                        <p class="font-thin italic hidden md:block w-3/12 whitespace-no-wrap">{{ingredient.inci}}</p>
                        <p class="font-thin italic w-2/12">${{ingredient.getCost(userData().settings.preferredUnits)}}
                          <span v-if="userData().settings.preferredUnits == 'g'" class="font-thin italic">/kg</span>
                          <span v-else-if="userData().settings.preferredUnits == 'Oz'" class="font-thin italic" >/Oz</span>
                        </p>
                        <p class="w-3/12 hidden md:flex flex-row justify-items-start" >
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
                  </div>
                  <div class="w-1/12 flex justify-end">
                    <p v-if="isPartOfFormula(ingredient)" ><font-awesome-icon :icon="['fas', 'fa-file-circle-exclamation']" v-tooltip="'Cannot delete ingredients that are part of a Formula'" class="text-slate-400"/></p>
                    <button v-else class="border-solid border-slate-500 rounded-md hover:bg-slate-400 px-1.5" @click="deleteIngredient(ingredient)" v-tooltip="'delete'" >X</button>
                    <!--                    todo : should probably add icon for delete as well to ensure same size, otherwise messes up alignment of tags and cost...-->
                  </div>

                </div>

              </li>
          </ul>

      </div>
      <button-standard :text="'Add Ingredient'" @click="addIngredientClick" />

    <edit-ingredient-component v-if="showEditWindow"
                               :ingredient-list="data.ingredientList"
                               :item="data.ingredientList.getHighlightIngredient()"
                               :itemCopy="selectedItemCopy"
                               :ingredient-in-formulas="foundInFormulasList"
                               @close="closeEditWindow"
                               @refresh="refreshInFormulaList" />
    <add-ingredient-component v-if="showAddWindow"
                              :item="newIngredient"
                              @cancel="cancelAdd"
                              @updateItem="addIngredient"/>
  </div>


    
</template>
    
<script setup lang="ts">
import {computed, onMounted, provide, ref} from "vue";

import Ingredient from "../types/Ingredient";
import EditIngredientComponent from "./EditIngredientComponent.vue";
import ButtonStandard from "./ButtonStandard.vue";
import AddIngredientComponent from "./AddIngredientComponent.vue";
import {useAccountStore} from "../stores/account";

import {userData} from "../stores/userData";
import Formula from "../types/Formula";
import IngredientList from "@/types/IngredientList";

const data = userData()
const newIngredient = new Ingredient(0,0,"new ingredient", "", 0, null, [])
const ingredients = ref<Ingredient[]>(data.ingredientList.ingredients)
const showEditWindow = ref(false);

let api = data.api;
const showAddWindow = ref(false);
const selectedItemCopy = ref<Ingredient>(newIngredient)
let foundInFormulasList = ref<Formula[]>([]);

const editIngredient = (ingredient :Ingredient) => {
  data.ingredientList.setHighlightIngredient(ingredient);
  data.ingredientList.setHighlightIndex(data.ingredientList.ingredients.indexOf(ingredient))
  selectedItemCopy.value = data.ingredientList.getHighlightIngredientCopy();
  foundInFormulasList.value = inFormulas.value(ingredient);
  showEditWindow.value = true;
}

let formulas = computed( () => data.formulaList.formulas);

// TODO move this to ingredientList
const inFormulas = computed(() => {
  return (ingredient: Ingredient): Formula[] => {
    if (!formulas.value || formulas.value.length === 0) {
      return [];
    }
    return formulas.value.filter((formula) => formula.hasIngredient(ingredient));
  };
});

function isPartOfFormula(ingredient :Ingredient) :boolean {

  return inFormulas.value(ingredient).length > 0;

  if (formulas !== undefined) {
    for (let i = 0; i < formulas.length; i++) {
      if(formulas[i].hasIngredient(ingredient)) {
        return true;
      }
    }
  }
  return false;

}

function refreshInFormulaList() {
  foundInFormulasList.value = inFormulas.value(data.ingredientList.getHighlightIngredient());
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

onMounted(async () => {

});

async function refreshIngredients() {
  await data.refreshIngredientList()
  ingredients.value = data.ingredientList.ingredients
}

const deleteIngredient = (ingredient :Ingredient) => {
  data.ingredientList.removeIngredient(ingredient);
  api.getIngredientService().deleteIngredient(ingredient).then( (response) => {
    useAccountStore().notify("Ingredient deleted", "success")
  })
}

function addIngredientClick() {
  showAddWindow.value = true;
}

async function addIngredient(ingredient :Ingredient)  {
  api.getIngredientService().createIngredient(ingredient).then(response => {
    useAccountStore().notify(ingredient.name + " stored", "success" )
    console.log(response);
  });
  showAddWindow.value = false;

  await refreshIngredients();
}


</script>