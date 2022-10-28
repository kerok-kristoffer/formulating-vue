<template>
    <h1 class="text-3xl mb-6">Ingredients</h1>

      <!-- Add function table, side-by-side with Ingredients on md, col on mobile -->
          <!-- replaced by tags, that can include functions -->
      <div class="flex flex-row mb-6 px-12 w-4/5 pb-3">
          <ul class="w-full text-left h-128">
              <li class="flex flex-row bg-slate-200">
                <p class="w-1/6 font-bold">Name</p>
                <p class="w-1/6 font-bold">Inci</p>
                <p class="w-1/6 font-bold">Estimated Cost ($/kg)</p>
                <p class="w-2/6 font-bold">Tags</p>
              </li>

              <li class="w-full even:bg-slate-100 odd:bg-slate-200 hover:bg-slate-300" v-for="ingredient, index in ingredients" :key="ingredient.id">
                      <div @click="editToggle(index)" v-show="editing !== index" class="w-full  flex flex-row hover:cursor-pointer">
                        <p class="font-bold w-1/6">{{ingredient.name}}</p>
                        <p class="font-thin italic w-1/6">{{ingredient.inci}}</p>
                        <p class="font-thin italic w-1/6">{{ingredient.cost}}</p>
                        <p class="w-2/6 flex flex-row justify-items-start" >
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
                      <div v-show="editing === index" class="w-full flex">
                        <input type="text" class="w-1/6 h-6" v-model="ingredient.name">
                        <input type="text" class="w-1/6 h-6" placeholder="inci" v-model="ingredient.inci">
                        <input type="number" class="w-1/6 h-6" placeholder="cost/kg" v-model="ingredient.cost">
                        <div class="tag-input w-2/6 h-6 ">
                          <div 
                              v-for="tag, index in ingredient.tags"
                              class="tag-input__tag">

                              <span @click="ingredient.removeTag(index)">x</span>
                              {{ tag.name }}
                          </div>
                          <input
                              type="text"
                              @keydown="addTag($event, ingredient)"
                              @keydown.delete="removeLastTag($event, ingredient)"
                              placeholder="Enter a tag"
                              class="h-6
                              border-none 
                              outline-none 
                              font-extralight
                              bg-none
                              "
                          />
                      </div>
                      <div class="w-1/6 my-auto flex justify-end gap-1">
                        <button @click="updateIngredient(ingredient)" class="bg-slate-400 p-1 rounded-md">Update</button>
                        <button @click="deleteIngredient(ingredient)" class="bg-rose-300 p-1 rounded-md">Delete</button> 
                        <button @click="editToggle(-1)" class="bg-slate-300 p-1 mr-1 rounded-md">X</button>
                      </div>
                      
                    </div>
              </li>
          </ul>
      </div>
      <paginate
      :page-count="pageCount"
      :page-range="5"
      :margin-pages="2"
      :click-handler="paginateCallback"
      :container-class="'flex flex-row my-2 mx-36'"
      :prev-text="'<'"
      :next-text="'>'"
      :prev-class="'bg-slate-300 hover:bg-slate-400 p-2 px-4 mx-1 rounded-md text-lg'"
      :next-class="'bg-slate-300 hover:bg-slate-400 p-2 px-4 mx-1 rounded-md text-lg'"
      :page-class="'bg-slate-300 hover:bg-slate-400 p-2 px-4 mx-1 rounded-md text-lg'"
      :active-class="'bg-blue-300 text-xl'"
    >
    </paginate>

    <div class="flex flex-col items-center mb-6 bg-gray-100 py-6">
      
      <div class="forms">
        <h2 class="text-lg">Add Ingredients</h2>
          <input
            v-model="newIngredient.Name"
            type="text"
            placeholder="name"
          />
          <input 
            v-model="newIngredient.Inci" 
            type="text"
            placeholder="Inci"
          />
          <button class="bg-slate-300 p-2 px-3 mx-1 rounded-md text-lg"
            @click="addIngredient"
           >Add</button>
      </div>
    </div>
    
</template>
    
<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from 'axios';
import Paginate from 'vuejs-paginate-next';
import Ingredient from "../types/Ingredient";

const editing = ref(-1)
const newIngredient = ref({Name: "", Inci: ""})
const ingredients = ref<Ingredient[]>([])
const ingredientCount = ref(1)
const pageCount = ref(1)
const pageSize = 20;
let currentPage = 1;

const editToggle = (index) => {
  editing.value = index
}

const getIngredients = () => {
  let url = 'users/ingredients?page_id=' + currentPage + '&page_size=' + pageSize
  axios.get(url).catch(error => {

  }).then((response :any) => {
    ingredients.value = []
    for (let i in response.data) {
        let ing = response.data[i]
        let ingredient = new Ingredient(ing.Id, ing.Id, ing.Name, ing.Inci, ing.cost, ing.tags)
        ingredients.value.push(ingredient)
    }
  });
}

onMounted(async () => {
  updateIngredientCount()
  getIngredients()
});


const paginateCallback = (pageNum) => {
  currentPage = pageNum
  getIngredients()
}

const updateIngredientCount = () => {
  axios.get('users/ingredients/count').then(response => {
    ingredientCount.value = response.data
    pageCount.value = (Number) (ingredientCount.value / pageSize)
  })
}

let editable = false

const updateIngredient = (ingredient :Ingredient) => {
  axios.post('users/ingredients/' + ingredient.ingredient_id, ingredient).catch((error) => {

  }).then( (response) => {
    editToggle(-1)
  })
}
const deleteIngredient = (ingredient :Ingredient) => {
  axios.delete('users/ingredients/' + ingredient.id).catch((error) => {
    
  }).then( (response) => {
    updateIngredientCount()
    editToggle(-1)
    let pageGotEmptied = currentPage > pageCount.value
    if(pageGotEmptied && currentPage > 1) {
      currentPage--
    }
    getIngredients()
  })
}

const addIngredient = e => {

  axios.post('users/ingredients', newIngredient.value).then(response => {
        updateIngredientCount()
        getIngredients()
        newIngredient.value = {Name: "", Inci: ""}
  })
}

const addTag = (event :any , ingredient :Ingredient) => {

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
      min-height: 1.5rem;
      background-color: white;
      border: 1px solid #eee;
      font-size: 0.9em;
      height: 50px;
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

  .tag-input__text {

  }
  
</style>