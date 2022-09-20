<template>
    <div>      
        <h1>Ingredients</h1>
        <ul>
            <li v-for="item in ingredients">
                {{item.name}}
            </li>
        </ul>
    </div>
</template>
    
<script>
import {onMounted, ref} from "vue";
import axios from 'axios';


 export default {
  data() {
    const ingredients = ref('');

    onMounted(async () => {
      const {data} = await axios.get('users/ingredients?page_id=1&page_size=10');

      ingredients.value = data;

    });

    return {
      ingredients
    }
  }
 }
</script>