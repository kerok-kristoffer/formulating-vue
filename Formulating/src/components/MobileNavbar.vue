<template>
  <!-- Mobile Navbar (Hidden on Large Screens) -->
  <nav class="bg-slate-100 dark:bg-slate-300 md:hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <p class="flex flex-row items-center font-normal">
              <img
                class="my-4 h-12 w-34"
                src="../assets/mySatchel_text.png"
                alt="mySatchel"
              />
            </p>
          </div>
        </div>
        <div class="block md:hidden">
          <!-- Hamburger Button -->
          <button
            @click="toggleMobileMenu"
            class="text-gray-500 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Expanded Mobile Menu -->
  <div
    v-if="isMobileMenuOpen"
    class="fixed inset-0 bg-white dark:bg-slate-600 bg-opacity-75 dark:bg-opacity-75 z-50 flex justify-end"
  >
    <div class="bg-white dark:bg-slate-400 w-3/4 md:w-1/2 lg:w-1/3 p-6">
      <div class="flex justify-end">
        <!-- Close Button -->
        <button
          @click="closeMobileMenu"
          class="text-gray-500 hover:bg-red-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
        >
          Close
        </button>
      </div>
      <div class="flex flex-col mt-4">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          active-class="bg-gray-100 dark:bg-slate-500 text-white dark:text-slate-200"
          :class="[
            path === item.to
              ? ''
              : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-400 hover:text-black',
            'px-3 py-2 rounded-md text-sm font-medium'
          ]"
          @click="closeMobileMenu"
        >
          {{ item.name }}
        </router-link>
        <!-- Add more menu items here if needed -->

        <button
          @click="logout"
          class="text-gray-500 hover:bg-red-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
        >
          log out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { navigation } from '@/navigation'
import { useAccountStore } from '@/stores/account'

const router = useRouter()
const path = computed(() => router.currentRoute)
const account = useAccountStore()
let isMobileMenuOpen = ref(false)

async function logout() {
  await account.logout()
  console.log('redirecting to login')
  router.push('/login')
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>
