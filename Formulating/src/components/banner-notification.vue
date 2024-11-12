<template>
  <div v-if="isUpdateAvailable" class="bg-slate-300 px-4 py-2">
    <p>A new version is available! Make sure to save changes before reloading!</p>
    <div class="flex justify-end mt-2">
      <button
        class="bg-slate-400 border border-slate-500 rounded hover:bg-slate-500 px-3 py-1 mr-2"
        @click="dismissBanner"
      >
        Dismiss
      </button>
      <button
        class="bg-slate-400 border border-slate-500 rounded hover:bg-slate-500 px-3 py-1"
        @click="updatePage"
      >
        Update
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAccountStore } from '../stores/account'
import {userData} from "@/stores/userData";

const account = useAccountStore()

const isUpdateAvailable = ref(false)

const dismissBanner = () => {
  isUpdateAvailable.value = false
}

const updatePage = () => {
  location.reload()
}

const performUpdateCheck = async () => {
  if (userData().debug) {
    console.log('current version from performUpdateCheck: ' + account.version)
  }
  await account.versionCheck()
  isUpdateAvailable.value = account.newVersionAvailable
  if (account.newVersionAvailable) {
    if (userData().debug) {
      console.log('new version found from account')
    }
    // TODO Save token in cookies on reload so user does not have to login every time.
  }
  //isUpdateAvailable.value = isNewVersionAvailable;
}

onMounted(performUpdateCheck)
</script>
