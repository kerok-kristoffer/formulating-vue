<template> <!--todo : have to make In Formulas list scrollable for longer lists-->
<!--todo otherwise long lists pushes buttons outside of edit box-->
  <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center gap-2 ">
    <div class="bg-slate-100 dark:bg-slate-600 h-full md:h-4/5 pt-6 md:p-8 flex flex-col rounded-sm shadow-lg w-full md:w-1/3">
      <h2 class="text-xl font-semibold mb-4 ">Edit Ingredient</h2>
       <!-- todo: add a swipe left/right function that emits prev-next -->
        <div class="mb-4">
          <label for="name" class="block text-gray-600">Name</label>
          <input v-model="item.name" type="text" id="name" class="w-full border rounded-md p-2 dark:bg-slate-400" required />
        </div>
        <div class="mb-4">
          <label for="inci" class="block text-gray-600">Inci</label>
          <input v-model="item.inci" type="text" id="inci" class="w-full border rounded-md p-2 dark:bg-slate-400" />
        </div>
        <div class="mb-4">
          <label for="cost" class="block text-gray-600">Cost</label>
          <input v-model.number="item.cost" type="number" id="cost" class="w-full border rounded-md p-2 dark:bg-slate-400" />
        </div>
        <div class="mb-4">
          <div class="block tag-input h-24 border border-solid border-slate-500 bg-white dark:bg-slate-400">
            <div
                v-for="(tag, index) in item.tags"
                class="tag-input__tag bg-slate-200 dark:bg-slate-600">

              <span @click="item.removeTag(index)">x</span>
              {{ tag.name }}
            </div>
            <input
                type="text"
                @keydown="addTag($event, item)"
                @keydown.delete="removeLastTag($event, item)"
                placeholder="Enter a tag"
                class="h-6
                              border-none
                              outline-none
                              font-extralight
                              mt-1
                              bg-slate-200
                              dark:bg-slate-600
                              "
            />
          </div>
        </div>

      <div class="flex flex-col flex-grow">
        <div v-if="ingredientInFormulas.length > 0" >
          <p class="text-xl">In Formulas:</p>
          <ul v-for="formula in ingredientInFormulas">
            <!--           todo: add a clickableRow Component that does all the styling for this type of thing -->
            <li @click="moveToFormula(formula)" class="hover:bg-gray-200 hover:cursor-pointer">{{formula.name}}</li>
          </ul>
        </div>
      </div>


        <div class="flex md:flex-row flex-shrink-0 justify-between mb-2">
          <div class="flex justify-start gap-1 h-6">
            <button-standard :text="'Previous'" @click="prevIngredientClick(item)" />
            <button-standard :text="'Next'" @click="nextIngredientClick(item)" />
          </div>

          <div class="flex gap-1 justify-end h-6">
            <button-standard :text="'Save'" @click="updateItem(item)" />
            <button-standard :text="'Cancel'" @click="cancelEdit" />
          </div>
        </div>

      <AlertPopup v-if="isAlertVisible"
                  :promptText="alertText"
                  :callback="callBack"
                  @yes-click="handleAlertYesClick"
                  @no-click="handleAlertNoClick"
                  @cancel-click="handleAlertCancelClick"/>

    </div>
  </div>
</template>


<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';
import Ingredient from "../types/Ingredient";
import ButtonStandard from "./ButtonStandard.vue";
import {userData} from "../stores/userData";
import Formula from "../types/Formula";
import {useAccountStore} from "../stores/account";
import {useRouter} from "vue-router";
import AlertPopup from "./AlertPopup.vue";

const { item } = defineProps<{
  item: Ingredient,
  itemCopy: Ingredient,
  ingredientInFormulas: Formula[] // todo - consider creating a viewModel class that contains this props
}>();



const emit = defineEmits(['close', 'refresh']);

const router = useRouter();
const formulas = userData().formulaList.formulas;
const showEditWindow = ref(true);
const isAlertVisible = ref(false);
const alertText = ref('Save changes made to ingredient?');
const data = userData()

type CallbackFunction = (arg?: any) => void;
let callBack: CallbackFunction;

// TODO perhaps use this alert functionality from a global function like userAccount?
// TODO could dynamically call it from anywhere and feed it with callback funcitons.
async function handleAlertYesClick(callback: CallbackFunction) {
  await data.ingredientList.publishHighlightedIngredient()
  data.ingredientList.setHighlightIngredient(data.ingredientList.getHighlightIngredient());
  isAlertVisible.value = false;

  callback();
}

function handleAlertNoClick(callback: CallbackFunction) {
  data.ingredientList.restoreHighlightIngredient();
  //emit('restore');

  isAlertVisible.value = false;
  callback();
}

function handleAlertCancelClick() {
  callBack = () => void{};
  isAlertVisible.value = false;
}

function alertUnsavedChangesToIngredient() {
  alertText.value = "Save changes made to ingredient?"
  isAlertVisible.value = true;
}

function moveToFormula(formula :Formula) :void{

  if (data.ingredientList.isHighlightIngredientDirty()) {
    useAccountStore().setCachedFormula(formula); // TODO is it good to force this before getting a yes/no/cancel?
    callBack = moveToCachedFormula;
    alertUnsavedChangesToIngredient();
    return;
  }

  useAccountStore().setCachedFormula(formula);
  moveToCachedFormula();
}

function moveToCachedFormula() {
  router.push("/formulas");
}

function prevIngredientClick() {
  if (data.ingredientList.isHighlightIngredientDirty()) {
    callBack = prevIngredientClick;
    alertUnsavedChangesToIngredient();
    return;
  }
  data.ingredientList.highlightPreviousIngredient();
  emit("refresh");

}
function nextIngredientClick() {
  if (data.ingredientList.isHighlightIngredientDirty()) {
    callBack = nextIngredientClick;
    alertUnsavedChangesToIngredient();
    return;
  }
  data.ingredientList.highlightNextIngredient();
  emit("refresh");
}

const updateItem = (ing :Ingredient) => {
  console.log("emit from updateItem: ", ing)
  data.api.getIngredientService().updateIngredient(ing).then(response => {
    console.log(response);
  })
  emit('close');
  showEditWindow.value = false; // TODO does this do anything anymore?
}

const cancelEdit = () => {
  if (data.ingredientList.isHighlightIngredientDirty()) {
    callBack = cancelEdit;
    alertUnsavedChangesToIngredient();
    return;
  }
  emit('close');
  showEditWindow.value = false;
};

function addTag(event :any , ingredient :Ingredient) {

  if( event.code == 'Comma' || event.code == 'Enter') {
    event.preventDefault();

    let val = event.target.value.trim()
    if (val.length > 0) {
      ingredient.addTag(val)
      event.target.value = ""
    }
  }
}

const removeLastTag = (event, ingredient :Ingredient) => {

  if (event.target.value.length === 0) {
    ingredient.removeLastTag()
  }
}
</script>

<style scoped>

.tag-input {
  min-width: 150px;
  min-height: 2rem;
  font-size: 0.9em;
  height: 120px;
  box-sizing: border-box;
  padding: 0 10px;
}

.tag-input__tag {
  height: 20px;
  float: left;
  margin-right: 2px;
  margin-top: 5px;
  line-height: 18px;
  padding: 0 3px;
  border-radius: 5px;
}

.tag-input__tag > span {
  cursor: pointer;
  opacity: 0.75;
}


</style>
