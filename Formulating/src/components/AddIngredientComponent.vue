<template>
  <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 dark:bg-slate-700">
    <div class="bg-slate-100 p-8 rounded-sm shadow-lg h-full md:h-4/5 w-full md:w-1/3">
      <h2 class="text-xl font-semibold mb-4">Add Ingredient</h2>
      <form @submit.prevent="updateItem">
        <div class="mb-4">
          <label for="name" class="block text-gray-600">Name</label>
          <input v-model="editedItem.name" type="text" id="name" class="w-full border rounded-md p-2 dark:bg-slate-500" required />
        </div>
        <div class="mb-4">
          <label for="inci" class="block text-gray-600">Inci</label>
          <input v-model="editedItem.inci" type="text" id="inci" class="w-full border rounded-md p-2 dark:bg-slate-500" />
        </div>
        <div class="mb-4">
          <label for="cost" class="block text-gray-600">Cost</label>
          <input v-model.number="editedItem.cost" type="number" id="cost" class="w-full border rounded-md p-2 dark:bg-slate-500" />
        </div>
        <div class="mb-4">
          <div class="block tag-input h-24 border border-solid border-slate-500 dark:bg-slate-500">
            <div
                v-for="(tag, index) in editedItem.tags"
                class="tag-input__tag ">

              <span @click="editedItem.removeTag(index)">x</span>
              {{ tag.name }}
            </div>
            <input
                type="text"
                @keydown="addTag($event, editedItem)"
                @keydown.delete="removeLastTag($event, editedItem)"
                placeholder="Enter a tag"
                class="h-6
                              border-none
                              outline-none
                              font-extralight
                              bg-none
                              "
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white rounded-md px-4 py-2">Save</button>
          <button @click="cancelEdit" class="ml-2 bg-gray-300 text-gray-700 rounded-md px-4 py-2">Cancel</button>
        </div>

      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import Ingredient from "../types/Ingredient";

const { item } = defineProps(['item']);
const emit = defineEmits(['updateItem', 'cancel']);

const editedItem = ref(new Ingredient(0, 0, item.name, item.inci, item.cost, item.tags));
const showEditWindow = ref(true);

const updateItem = () => {
  emit('updateItem', editedItem.value);
  showEditWindow.value = false;
};

const cancelEdit = () => {
  emit('cancel');
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
  background-color: white;
  font-size: 0.9em;
  height: 120px;
  box-sizing: border-box;
  padding: 0 10px;
}

.tag-input__tag {
  height: 20px;
  float: left;
  margin-right: 2px;
  background-color: #eee;
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
