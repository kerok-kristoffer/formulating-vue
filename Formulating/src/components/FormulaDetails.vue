<template>
  <div
    class="py-2 my-2 font-semibold rounded-md text-center"
  >
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2 m-auto">
          <div class="flex flex-col w-full mx-auto">
            <div class="profile bg-slate-200 p-3 rounded-md">
              <div v-if="formula.getInciList().length > 0" class="">
                  <h2 class="font-bold mt-2">Incis</h2>

                  <span v-for="inci in formula.getInciList()" :key="inci" class="text-sm font-light">
                    {{ inci }},
                </span>
              </div>


              <h2 class="mt-2">Notes</h2>
              <div class="flex flex-col w-full mb-1">
                        <textarea
                            v-model="formula.description"
                            rows="7"
                            cols="75"
                            resize="none"
                            name="description"
                            id="formula-description"
                            class="textarea"
                            placeholder="description"
                        />
              </div>
              <h2>First created: {{ formula.created_at }} | Last updated: {{ formula.updated_at }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {defineEmits, defineProps, onMounted, UnwrapRef} from "vue";
import Formula from "@/types/Formula";

const { formula } = defineProps<{
  formula: UnwrapRef<Formula>
}>();

onMounted(() => {
  console.log('mounted');
  console.log('formula:', formula);
  console.log('formula.getInciList():', formula.getInciList());
  console.log('formula.description:', formula.description);
  console.log('formula.created_at:', formula.created_at);
  console.log('formula.updated_at:', formula.updated_at);
});

const emit = defineEmits(['close']);

</script>

<style scoped></style>
