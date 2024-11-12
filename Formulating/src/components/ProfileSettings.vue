<template>
  <div class="profile bg-slate-200 p-3 border-2 border-slate-400 rounded-md mb-5">
    <h1 class="text-lg font-bold mb-2">Profile Settings</h1>
    <div class="mb-4">
      <label>
        <p class="flex flex-row">Preferred Units: <UnitSelector @unitSelected="saveSettings" /></p>
      </label>
    </div>
    <div>
      <h2 class="text-lg font-bold mb-2">Print Settings</h2>
      <div class="mb-2 flex items-center">
        <input
          type="checkbox"
          v-model="settings.printSettings.showInciList"
          @change="saveSettings"
          class="mr-2 accent-slate-300"
        />
        <label>Show INCI List</label>
      </div>
      <div class="mb-2 flex items-center">
        <input
          type="checkbox"
          v-model="settings.printSettings.showNotes"
          @change="saveSettings"
          class="mr-2 accent-slate-300"
        />
        <label>Show Formula Notes</label>
      </div>
      <div class="mb-2 flex items-center">
        <input
          type="checkbox"
          v-model="settings.printSettings.showInstructions"
          @change="saveSettings"
          class="mr-2 accent-slate-300"
        />
        <label>Show Phase Instructions</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userData } from '../stores/userData'
import { storeToRefs } from 'pinia'
import UnitSelector from '@/components/UnitSelector.vue'

const { settings } = storeToRefs(userData())

const saveSettings = () => {
  userData().settings.save()
}
</script>
