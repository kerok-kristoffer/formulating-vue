<template>
  <nav class="bg-slate-100 hidden md:block">
    <div class="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
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
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { navigation } from '@/navigation'
import {userData} from "@/stores/userData";

const router = useRouter()
const account = useAccountStore()
const path = computed(() => router.currentRoute)


async function logout() {
  await account.logout()
  if (userData().debug) {
    console.log('redirecting to login')
  }
  router.push('/login')
}
</script>
