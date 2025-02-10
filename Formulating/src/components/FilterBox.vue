<template>
  <p class="py-1 mb-2 bg-slate-300 font-semibold rounded-t-md text-center">Filters</p>
  <p></p>
  <div class="w-full">
    <div class="flex flex-row flex-wrap justify-items-start h-14 px-2">
      <ul v-for="(tag, index) in tags" :key="tag.id" class="">
        <li
          @click="toggleFilter(tag)" @click.stop
          class="h-5 font-extralight float-left mr-1 hover:bg-slate-400 hover:cursor-pointer rounded-md px-1 my-0.5 py-0"
          :class="tag.isActive ? 'bg-slate-400' : 'bg-slate-300'"
        >
          {{ tag.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Tag from "../types/Tag";

const emit = defineEmits<{
              toggleFilter: [tag: Tag]
}>()
const {tags} = defineProps<{
      tags: Tag[];
    }>();

function toggleFilter(tag :Tag) {
  emit('toggleFilter', tag)
}

</script>

<style scoped></style>
