<template>
  <div class="flex flex-col">
    <div class="flex flex-row  justify-end gap-1 py-1">
      <label class="" :for="'phase_add_ingredient-'+ phaseKey">Add ingredient: </label>
      <input
          v-model="phase.searchIngredient"
          autocomplete="off" type="text"
          @input="searchIngredient(phaseKey, phase.searchIngredient)"
          @keydown.down="focusNextSearchIngredient"
          @keydown.up="focusPreviousSearchIngredient"
          @keydown.enter="selectFocusedSearchIngredient(phase)"
          @blur="hideIngredientSearchResults"
          name="phaseAddIngredient"
          :id="'phase_add_ingredient-' + phaseKey +  mobileText"
          class="h-6 w-42">
      <font-awesome-icon :icon="['fas', 'search']" class="mr-1 mt-1" />
      <button v-show="phase.searchIngredient"
              :id="'add-search-ingredient-button-' + phaseKey"
              @click="addNewSearchIngredient(phase, phase.searchIngredient)"
              class="h-6 bg-slate-400 px-1 rounded-md font-semibold text-white">Create</button>

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
import {computed, nextTick, ref} from "vue";
import {userData} from "../stores/userData";

const data = userData()

const { phase, phaseKey, mobile } = defineProps<{
    phase: Phase,
    phaseKey: number,
  mobile: boolean
}>();

const emit = defineEmits([
  'addNewSearchIngredient',
    'addExistingIngredient'
]);

const searchIngredientList = ref<Ingredient[]>([])
const phaseCurrentlySearching = ref(-1)
const ingredients = computed(() => data.ingredientList.ingredients);
const focusedSearchIngredientIndex = ref<number>(-1);
const mobileText = mobile ? '-mob' : ''

const searchIngredient = (phaseKey :number, phaseSearchTerm :string) => {
  focusedSearchIngredientIndex.value = -1

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
  emit('addNewSearchIngredient', phase, input)
  searchIngredientList.value = []
}
function addExistingIngredient(phase :Phase, ingredient :Ingredient) {
  emit('addExistingIngredient', phase, ingredient)
  searchIngredientList.value = []
}

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
  if (phase.searchIngredient == undefined || phase.searchIngredient.length < 1) {
    return
  }
  if(focusedSearchIngredientIndex.value < 0 || focusedSearchIngredientIndex.value >= searchIngredientList.value.length) {
    addNewSearchIngredient(phase, phase.searchIngredient)
  } else {
    addExistingIngredient(phase, searchIngredientList.value[focusedSearchIngredientIndex.value])
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