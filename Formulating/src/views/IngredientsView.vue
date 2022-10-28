<template>
  <section class="container flex flex-col rounded-xl items-center py-6 px-6 mx-auto mt-10 space-y-0 bg-slate-100">
    <Ingredients />
  </section>
  
</template>

<script setup>
import { useRouter } from "vue-router";
import Ingredients from '../components/Ingredients.vue'



const router = useRouter();



</script>