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
                  <h2 class="font-bold mt-2">Inci</h2>

                  <span v-for="(inci, index) in sortedInciList" :key="inci" class="text-sm font-light">
                    {{ inci }}<span v-if="index < sortedInciList.length - 1">,</span>
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

import {computed, defineEmits, defineProps, onMounted, UnwrapRef} from "vue";
import Formula from "@/types/Formula";

const { formula } = defineProps<{
  formula: UnwrapRef<Formula>
}>();

const sortedInciList =  computed(() => {
  return formula.getInciList().slice();
})

onMounted(() => {
});

const emit = defineEmits(['close']);

</script>

<style scoped></style>
