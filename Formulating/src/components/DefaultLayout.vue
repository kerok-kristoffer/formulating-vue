<template>
  <main class="min-h-full">
    <header class="print:hidden bg-white shadow-md shadow-slate-200 dark:shadow-slate-600 mb-0 z-10">
      <NavBar />
      <MobileNavbar />
    </header>
    <Banner />
    <!-- todo need to make this a general banner that can dynamically show info, not just for hardcoded things like version updates. See notifications below -->
    <AuthenticatedContent />
    <Notification />
    <FeedbackButton />
  </main>
</template>

<script setup lang="ts">
import { userData } from '@/stores/userData'
import Notification from './Notification.vue'
import Banner from '../components/banner-notification.vue'
import { onMounted, ref } from 'vue'
import MobileNavbar from './MobileNavbar.vue'
import NavBar from './NavBar.vue'
import AuthenticatedContent from "@/components/AuthenticatedContent.vue";
import FeedbackButton from "@/components/FeedbackButton.vue";

const data = userData()
let loaded = ref(false)

onMounted(async () => {
  await data.ingredientList.populateWithTags()
  await data.formulaList.populate()
  loaded.value = true
})
</script>
