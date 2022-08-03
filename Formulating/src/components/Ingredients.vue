<template>
    <div>      
        <h1>List of Ingredients</h1>
        <ul>
            <li v-for="item in message">
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
    const message = ref('');

    onMounted(async () => {
      const {data} = await axios.get('users/ingredients?page_id=1&page_size=10');

      message.value = data;

    });

    return {
      message
    }
  }
 }
</script>