<template>
  <main>
    <h1>Welcome to Home</h1>
    <h3>{{message}}</h3>
  </main>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from 'axios';


 export default {
  name: "Home",
  setup() {
    const message = ref('');

    onMounted(async () => {
      const {data} = await axios.get('users/2');

      message.value = `Hi ${data.fullName}`;

    });

    return {
      message
    }
  }
 }
</script>
