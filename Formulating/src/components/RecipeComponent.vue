<script lang="ts">
   export default defineComponent({
        props: {
            ingredients: {
                required: true,
                type: Array as PropType<Ingredient[]>,
            }
        }
    })
</script>

<script lang="ts" setup>

    import { defineComponent, PropType, ref } from "vue";
    import Recipe from '../types/Formula';
    import Ingredient from "../types/Ingredient";
    import Phase from "../types/Phase";

    const recipe = ref(new Recipe("Magic", [] as Phase[], 0, 'new'))

    const onDrop = (event, phase :Phase) => {
        let ingredientId = event.dataTransfer.getData('ingredientId')
        console.log(ingredientId.value)

        let ingredient = {}

        //phase.ingredients.push(ingredient)
    }

    const startDrag = (e, phaseId) => {
        console.log(phaseId)
    }    


    // todo move recipe stuff to here from RecipesView.vue
        // use tut: https://www.youtube.com/watch?v=GdWrYfDfqRE&list=PL4cUxeGkcC9gCtAuEdXTjNVE5bbMFo5OD&index=4

    let text = ref('Hello from Recipe Component')
 
</script>

<template>
    <div id="recipe-box">
        <h2>Recipe</h2>

        <p>
            <input type="text" name="recipe-name" id="recipe-name" v-model="recipe.name">
        </p>

        <div v-for="phase in recipe.phases">
            <div class="drop-zone" 
                @drop="onDrop($event, phase)"
                @dragenter.prevent
                @dragover.prevent>
            {{ phase.name }}

                <div 
                    v-for="item in ingredients" 
                    :key="item.id" 
                    class="drag-el recipe-item" 
                    draggable="true"
                    @dragstart="startDrag($event, item)">

                    <p>              
                        {{ item.name }}
                    </p>
                    <p class="row">
                        <input v-model="item.inci" type="text" name="inci" id="inci" placeholder="INCI">
                        <label for="inci">: </label>
                    </p>
                    <p class="row">
                        <input v-model="item.percentage" type="number" name="percentage" id="percentage">
                        <label for="percentage">%</label>
                    </p>
                    
                    <p class="row">
                        <input  v-bind="item.weightInGrams" type="number" name="amount" id="amount">
                        <label for="amount">g</label>
                    </p>

                </div>

            </div>
        </div>


    </div>
</template>