<template>
  <main class="min-h-full">
    <header class="print:hidden bg-white dark:bg-slate-500 shadow-md shadow-slate-200 dark:shadow-slate-400 mb-0 z-10">
      <NavBar />
      <MobileNavbar />
    </header>
    <Banner />
    <!-- todo need to make this a general banner that can dynamically show info, not just for hardcoded things like version updates. See notifications below -->
    <AuthenticatedContent />
    <FeedbackButton />
    <div v-if="account.isLoading" class=""></div>
  </main>
</template>

<script setup lang="ts">
import { userData } from '@/stores/userData'
import Banner from '../components/banner-notification.vue'
import { onMounted, ref } from 'vue'
import MobileNavbar from './MobileNavbar.vue'
import NavBar from './NavBar.vue'
import AuthenticatedContent from '@/components/AuthenticatedContent.vue'
import FeedbackButton from '@/components/FeedbackButton.vue'
import {useAccountStore} from "@/stores/account";

let loaded = ref(false)
let account = useAccountStore()

onMounted(async () => {
  await userData().initLists()
  loaded.value = true
})
</script>
