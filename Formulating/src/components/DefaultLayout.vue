<template>
  <main class="min-h-full">
    <header class="bg-white shadow-md shadow-slate-200 dark:shadow-slate-600 mb-0 z-10">
      <nav class="bg-slate-100 hidden md:block">
        <div class="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <p class="flex flex-row items-center font-normal">
                  <!--<img class="h-12 w-16" src="../assets/satchel_logo.png" alt="mySatchel" /> -->
                  <img
                    class="mb-4 h-20 w-34"
                    src="../assets/mySatchel_logo_plain.png"
                    alt="mySatchel"
                  />
                </p>
              </div>
            </div>
            <div class="">
              <div class="flex mr-28 items-baseline space-x-4">
                <router-link
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.to"
                  active-class="bg-gray-100 text-white"
                  :class="[
                    path === item.to ? '' : 'text-gray-500 hover:bg-gray-200 hover:text-black',
                    'px-3 py-2 rounded-md text-sm font-medium'
                  ]"
                  >{{ item.name }}
                </router-link>
              </div>
            </div>
            <div class="">
              <div class="ml-4 flex items-center md:ml-6">
                <button
                  @click="logout"
                  class="text-gray-500 hover:bg-red-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  log out
                </button>
                <!-- todo: profile dropdown -->
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Mobile Navbar (Hidden on Large Screens) -->
      <nav class="bg-slate-100 dark:bg-slate-400 md:hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <p class="flex flex-row items-center font-normal">
                  <img
                    class="mb-4 h-20 w-34"
                    src="../assets/mySatchel_logo_plain.png"
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
                path === item.to ? '' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-400 hover:text-black',
                'px-3 py-2 rounded-md text-sm font-medium'
              ]"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </router-link>
            <!-- Add more menu items here if needed -->
          </div>
        </div>
      </div>
    </header>
    <Banner />
    <!-- todo need to make this a general banner that can dynamically show info, not just for hardcoded things like version updates. See notifications below -->
    <router-view v-if="loaded" :key="$route.path"></router-view>
    <div v-else><loading-indicator /></div>

    <Notification />
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '../stores/account.ts'
import { userData } from '../stores/userData.ts'
import { useRouter } from 'vue-router'
import Notification from './Notification.vue'
import Banner from '../components/banner-notification.vue'
import { computed, onMounted, ref } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'

const router = useRouter()
const account = useAccountStore()
const data = userData()
const path = computed(() => router.currentRoute)
let loaded = ref(false)

onMounted(async () => {
  await data.ingredientList.populateWithTags()
  await data.formulaList.populate()
  loaded.value = true
})

const navigation = [
  { name: 'Ingredients', to: '/ingredients' },
  { name: 'Formulate', to: '/formulas' },
  { name: 'Profile', to: '/profile' }
  //{ name: "Sub", to: "/plans"}
]

let isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  // You can add additional logic here if needed
}

const logout = () => {
  account.logout()
  router.push('/login')
}
</script>
