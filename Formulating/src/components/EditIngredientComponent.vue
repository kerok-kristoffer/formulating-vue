<template> <!--todo : have to make In Formulas list scrollable for longer lists-->
<!--todo otherwise long lists pushes buttons outside of edit box-->
  <div class="fixed inset-0 flex items-center justify-center bg-slate-400/60">
    <div v-if="item" class="relative bg-slate-200 h-full md:h-4/5 w-full md:w-2/3 max-h-[90vh] flex flex-col rounded-sm shadow-lg">
      <h2 class="text-xl font-semibold px-6 py-3">Edit Ingredient</h2>
      <div class="flex-1 relative overflow-y-auto px-6 pt-4 pb-8 border-y-2 border-slate-300 dark:border-slate-300">
        <!-- todo: add a swipe left/right function that emits prev-next -->
        <div class="mb-4">
          <label for="name" class="block text-gray-600">Name</label>
          <input v-model="item.name" type="text" id="name" class="w-full border rounded-md p-2 dark:bg-slate-100" required />
        </div>
        <div class="mb-4">
          <label for="inci" class="block text-gray-600">Inci</label>
          <input v-model="item.inci" type="text" id="inci" class="w-full border rounded-md p-2 dark:bg-slate-100" />
        </div>
        <label for="cost" class="block text-gray-600 w-1/12">Cost</label>
        <div class="mb-4 flex flex-row w-full items-end">
          <input :value="computedCost" @input="item.setCost(parseFloat($event.target.value), data.settings.preferredUnits)" type="number" id="cost" class="w-10/12 border rounded-md p-2 dark:bg-slate-100 mr-0.5" />
          <span v-if="userData().settings.preferredUnits == 'g'">/kg</span>
          <span v-else>/Oz</span>
<!--          <input :value="computedCost" @input="updateCost($event.target.value)" type="number" id="cost" class="w-10/12 border rounded-md p-2 dark:bg-slate-100" />
          unit:<UnitSelector class="w-1/12" @unitSelected="setUnit"></UnitSelector>-->
        </div>
        <div class="mb-4">
          <label for="notes" class="block text-gray-600">Notes</label>
          <textarea v-model="item.info" rows="5" id="notes" class="w-full border rounded-md p-2 dark:bg-slate-100" />
        </div>

        <div class="mb-4">
          <label for="tags" class="block text-gray-600">Tags</label>
          <div class="block tag-input h-24 border border-solid border-slate-500 bg-white dark:bg-slate-100">
            <div
                v-for="(tag, index) in item.tags"
                class="tag-input__tag bg-slate-200 dark:bg-slate-200">

              <span @click="item.removeTag(index)">x</span>
              {{ tag.name }}
            </div>
            <!-- TODO make tags work like searchIngredients, generate list of available tags for reuse-->
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
                              dark:bg-slate-200
                              "
            />
          </div>

          <div class="flex flex-col flex-grow overflow-y-auto">
            <div v-if="ingredientInFormulas.length > 0" >
              <p class="text-xl">In Formulas:</p>
              <ul v-for="formula in ingredientInFormulas" >
                <!--           todo: add a clickableRow Component that does all the styling for this type of thing -->
                <li @click="moveToFormula(formula)" class="hover:bg-slate-300 hover:cursor-pointer">{{formula.name}}</li>
              </ul>
            </div>
          </div>
        </div>



      <div v-if="userData().debug" class="debug-info fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-2 border-slate-400 rounded-md p-2 shadow-md">
        <p>  </p>
<!--        <p>HI{{data.ingredientList.getHighlightIngredient().name}}</p>-->
<!--        <p>HI cost{{data.ingredientList.getHighlightIngredient().getCost(data.settings.preferredUnits)}}</p>-->
<!--        <p>HIC{{data.ingredientList.getHighlightIngredientCopy().name}}</p>-->
<!--        <p>HIC cost{{data.ingredientList.getHighlightIngredientCopy().getCost(data.settings.preferredUnits)}}</p>-->
<!--        <p>dirty: {{data.ingredientList.isHighlightIngredientDirty()}}</p>-->
      </div>


    </div>


      <div class="flex flex-row flex-shrink-0 justify-between w-full px-6 py-4 z-20 bg-slate-200">
        <div class="flex justify-start gap-1 h-6">
          <button-standard :text="'Previous'" @click="prevIngredientClick()" />
          <button-standard :text="'Next'" @click="nextIngredientClick()" />
        </div>

        <div class="flex gap-1 justify-end h-6">
          <button-standard :text="'Save'" @click="updateItem(item)" />
          <button-standard :text="'Cancel'" @click="cancelEdit" />
        </div>
      </div>

    </div>

    <AlertPopup v-if="isAlertVisible"
                :promptText="alertText"
                :callback="callBack"
                @yes-click="handleAlertYesClick"
                @no-click="handleAlertNoClick"
                @cancel-click="handleAlertCancelClick"/>
  </div>
</template>


<script setup lang="ts">
import {computed, defineEmits, defineProps, ref, watch} from 'vue';
import Ingredient from "../types/Ingredient";
import ButtonStandard from "./ButtonStandard.vue";
import {userData} from "../stores/userData";
import Formula from "../types/Formula";
import {useRouter} from "vue-router";
import AlertPopup from "./AlertPopup.vue";
import IngredientList from "@/types/IngredientList";
import {useAccountStore} from "@/stores/account";
const { item, ingredientList } = defineProps<{
  item: Ingredient,
  itemCopy: Ingredient,
  ingredientInFormulas: Formula[] // todo - consider creating a viewModel class that contains this props
  ingredientList: IngredientList
}>();

const emit = defineEmits(['close', 'refresh']);

const router = useRouter();
const isAlertVisible = ref(false);
const alertText = ref('Save changes made to ingredient?');
const data = userData()
type CallbackFunction = (arg?: any) => void;
let targetFormula;
let callBack: CallbackFunction;

const computedCost = computed(() => {
  return ingredientList.getHighlightIngredient().getCost(userData().settings.preferredUnits)
})

function updateCost(cost :string) {
  const numericCost = parseFloat(cost);
  if(!isNaN(numericCost)) {
    item.setCost(numericCost, userData().settings.preferredUnits)
  }
}

// TODO move this to global Alert in userData
async function handleAlertYesClick(callback: CallbackFunction) {
  if (userData().debug) {
    console.log("handleAlertYesClick, cost: ", ingredientList.getHighlightIngredient().getCost(userData().settings.preferredUnits))
  }
  isAlertVisible.value = false;

  if (ingredientList.highlightIngredient.name == undefined || ingredientList.highlightIngredient.name == "") {
    useAccountStore().notify("Ingredient name is required", "error")
    return
  }
  await ingredientList.publishHighlightedIngredient()
  ingredientList.refreshIngredient(ingredientList.getHighlightIngredient())
  ingredientList.updateHighlightIngredientCopy();
  data.updateDisplayFormulaWeightsAndCosts();

  // ingredientList.setHighlightIngredient(ingredientList.getHighlightIngredientCopy()); // Ensure the highlightIngredient is updated
  if (userData().debug) {
    console.log("handled AlertYesClick, running callback" + callback)
  }
  callback();
}

function handleAlertNoClick(callback: CallbackFunction) {
  updateCost(ingredientList.getHighlightIngredientCopy().getCost(userData().settings.preferredUnits).toString())
  ingredientList.restoreHighlightIngredient();
  console.log("handleAlertNoClick, cost: ", item.getCost(userData().settings.preferredUnits))
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

function isIngredientDirtyCheck() { // TODO need to oversee the dirty check, it does not always engage
  // also, make sure the cost is updated when moving between ingredients
  // ingredientList.highlightIngredient.setCost(computedCost.value, userData().settings.preferredUnits);
  return ingredientList.isHighlightIngredientDirty();
}

function moveToFormula(formula :Formula) :void{

  targetFormula = formula; // TODO fix this workaround
  if (isIngredientDirtyCheck()) {
    // data.setCachedFormula(formula); // TODO is it good to force this before getting a yes/no/cancel?
    callBack = moveToCachedFormula;
    alertUnsavedChangesToIngredient();
    return;
  }
  moveToCachedFormula();
}

function moveToCachedFormula() {
  if(targetFormula.id != data.getCachedFormula().id) {
    data.attemptSetDisplayFormula(targetFormula);
  }
  router.push("/formulas");
}

function prevIngredientClick() {
  if (isIngredientDirtyCheck()) {
    callBack = prevIngredientClick;
    alertUnsavedChangesToIngredient();
    return;
  }
  console.log("dirty check passed, moving to previous ingredient")
  ingredientList.highlightPreviousIngredient();
  // updateCost(ingredientList.getHighlightIngredient().getCost(userData().settings.preferredUnits).toString())
  emit("refresh");
// TODO price does not behave correctly when moving between ingredients
    // dirty check seems to not engage always
  // also got the price set to hte previous ingredient when clicking previous
}
function nextIngredientClick() {
  if (isIngredientDirtyCheck()) {
    callBack = nextIngredientClick;
    alertUnsavedChangesToIngredient();
    return;
  }
  ingredientList.highlightNextIngredient();
  // updateCost(ingredientList.getHighlightIngredient().getCost(userData().settings.preferredUnits).toString())
  emit("refresh");
}

const updateItem = (ing :Ingredient) => {


  if (ing.name === undefined || ing.name.length === 0) {
    useAccountStore().notify("Name cannot be empty", "error");
    return;
  }

  data.api.getIngredientService().updateIngredient(ing).then(response => {
    data.updateDisplayFormulaWeightsAndCosts();
  }).catch(error => {
    useAccountStore().notify("Error updating ingredient", "error");
  }).finally(() => {
    closeEditWindow()
  });
}

const cancelEdit = () => {
  if (isIngredientDirtyCheck()) {
    callBack = cancelEdit;
    alertUnsavedChangesToIngredient();
    return;
  }
  closeEditWindow()
};

function closeEditWindow() {
  emit('close');
}

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
