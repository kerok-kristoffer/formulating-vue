<template>
  <tr>
    <td class="border p-4">{{ feature }}</td>
    <td class="border p-4"><Checkmark :checked="mySatchel" /></td>
    <td class="border p-4"><Checkmark :checked="spreadsheets" /></td>
    <td class="border p-4"><Checkmark :checked="otherCalculators" /></td>
  </tr>
</template>

<script setup>
import Checkmark from './Checkmark.vue'
import { defineProps } from 'vue'

const props = defineProps({
  feature: String,
  mySatchel: String,
  spreadsheets: String,
  otherCalculators: String
})
</script>