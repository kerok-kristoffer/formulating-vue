<template>
  <div>
      <Ingredients />
  </div>

  <div class="add">
    <h1>Add Ingredients!</h1>
    <section class="forms">
      <form class="ingredient" @submit.prevent="submit">
        <h2>Ingredient:</h2>
        <input
          placeholder="water"
          type="text"
          name="Name"
        >
        <input placeholder="INCI" type="text" name="Inci" />
        <input
          value="Add"
          type="submit"
        >
      </form>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import Ingredients from '../components/Ingredients.vue'


 export default {

  name: "Ingredient",
  setup () {
    const router = useRouter();

    const submit = async e => {
      const form = new FormData(e.target);

      const inputs = Object.fromEntries(form.entries());

      const {data} = await axios.post('users/ingredients', inputs, {
        withCredentials: true
      });
    }

    return {
      submit
    }
  },
    components: {
    Ingredients
  },

 }
</script>