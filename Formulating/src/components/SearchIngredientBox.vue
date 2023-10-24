<template>
  <div class="flex flex-col">
    <div class="flex flex-row  justify-center gap-1 py-1">
      <label class="" for="phase_add_ingredient">Add ingredient: </label>
      <input
          v-model="phase.searchIngredient"
          autocomplete="off" type="text"
          @input="searchIngredient(phaseKey, phase.searchIngredient)"
          @keydown.down="focusNextSearchIngredient"
          @keydown.up="focusPreviousSearchIngredient"
          @keydown.enter="selectFocusedSearchIngredient(phase)"
          @blur="hideIngredientSearchResults"
          name="phaseAddIngredient"
          id="phase_add_ingredient"
          class="h-6 w-42">
      <font-awesome-icon :icon="['fas', 'search']" class="mr-1 mt-1" />
      <button v-show="phase.searchIngredient" @click="addNewSearchIngredient(phase, phase.searchIngredient)" class="h-6 w-14 bg-slate-400 rounded-md font-semibold">Create</button>

    </div>
    <div v-if="phaseCurrentlySearching === phaseKey && searchIngredientList" class="flex flex-row justify-end">
      <ul class="absolute z-50 bg-slate-200 drop-shadow-lg flex flex-col gap-1 max-h-64 overflow-y-auto overflow-x-hidden">
        <li v-for="(searchResult, index) in searchIngredientList" :key="index" :id="'search-item-' + index"
            @mouseover="focusSearchResultIngredientIndex(index)"
            @click="selectFocusedSearchIngredient(phase)"

            class="flex flex-row justify-between
                                                hover:cursor-pointer w-64"

            :class="{ 'bg-slate-400': (index === focusedSearchIngredientIndex) }"
        >
          <div  class="w-full ">{{ searchResult.name }}</div>
        </li>

      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import Phase from "../types/Phase";
import Ingredient from "../types/Ingredient";
import {nextTick, ref} from "vue";
import axios from 'axios';// TODO move API calls to backend api service
import {userData} from "../stores/userData";

const data = userData()

const { phase, phaseKey } = defineProps<{
    phase: Phase,
    phaseKey: Number
  }>();

const searchIngredientList = ref<Ingredient[]>([])
const phaseCurrentlySearching = ref(-1)
const ingredients = ref<Ingredient[]>(data.ingredientList.ingredients)

const searchIngredient = (phaseKey :number, phaseSearchTerm :string) => {

  if(phaseSearchTerm.length < 1) {
    searchIngredientList.value = []
    phaseCurrentlySearching.value = -1
    return
  }
  phaseCurrentlySearching.value = phaseKey

  searchIngredientList.value = ingredients.value.filter(ingredient => {
    return ingredient.name.toLowerCase().startsWith(phaseSearchTerm.toLowerCase())
  })
}

const addNewSearchIngredient = (phase :Phase, input :string) => {

  let requestIngredient = new Ingredient(0, 0, input, "", 0, [])

  axios.post('users/ingredients', requestIngredient).then(response => {
    if (response.status !== 200) {
      return
    }
    let ing = response.data

    let responseIngredient = new Ingredient(ingredients.value.length, Number(ing.Id), ing.Name, ing.Inci, ing.cost, [])
    ingredients.value.push(responseIngredient)
    ingredients.value.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 });
    addSearchIngredient(phase, responseIngredient)
  });
}
// TODO add Ingredient and Formula factory to avoid calling constructor directly
const addSearchIngredient = (phase :Phase, ingredient :Ingredient) => {
  let newFormulaIngredient = new Ingredient(0, ingredient.ingredient_id, ingredient.name, ingredient.inci, ingredient.cost, ingredient.tags)
  ingredient.formula_ingredient_id = 0
  phase.addIngredient(newFormulaIngredient)
  phase.searchIngredient = ""
  searchIngredientList.value = []
}
let focusedSearchIngredientIndex = ref<number>(-1);


async function focusNextSearchIngredient() {
  let index = focusedSearchIngredientIndex.value
  if (index < searchIngredientList.value.length -1) {
    focusedSearchIngredientIndex.value++
    await nextTick()
    scrollToFocusedSearchIngredient()
    return
  }

  focusedSearchIngredientIndex.value = -1
  await nextTick()
  scrollToFocusedSearchIngredient()
}
async function focusPreviousSearchIngredient() {
  let index = focusedSearchIngredientIndex.value
  if (index > -1) {
    focusedSearchIngredientIndex.value--
    await nextTick()
    scrollToFocusedSearchIngredient()
    return;
  }

  focusedSearchIngredientIndex.value = searchIngredientList.value.length -1
  await nextTick()
  scrollToFocusedSearchIngredient()
}

const root = ref(null)

const focusSearchResultIngredientIndex = (index :number) => {
  focusedSearchIngredientIndex.value = index
}

const selectFocusedSearchIngredient = (phase :Phase) => {
  if(focusedSearchIngredientIndex.value == -1) {
    addNewSearchIngredient(phase, phase.searchIngredient)
  } else {
    addSearchIngredient(phase, searchIngredientList.value[focusedSearchIngredientIndex.value])
    focusedSearchIngredientIndex.value = -1
  }
}

const scrollToFocusedSearchIngredient = () => {

  const el = document.getElementById('search-item-' + focusedSearchIngredientIndex.value)
  if(el) {
    el.scrollIntoView({block: "nearest", behavior: "smooth"})
  }
}

async function hideIngredientSearchResults() {
  setTimeout( () => phaseCurrentlySearching.value = -1, 500);
}
</script>

<style scoped>

</style>