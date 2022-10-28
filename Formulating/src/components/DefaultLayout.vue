<template>
    <main class="min-h-full"> 
        <header class="bg-white shadow">
            <nav class="bg-white">
                <div class="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <p class="flex flex-row items-center  font-normal">
                                    <img class="h-8 w-8" src="../assets/logo-v2.png" alt="mySatchel" />
                                    mySatchel
                                </p>
                                
                            </div>
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <router-link v-for="item in navigation"
                                :key="item.name"
                                :to="item.to"
                                active-class="bg-gray-100 text-white"
                                :class="[path === item.to
                                ? ''
                                : 'text-gray-500 hover:bg-gray-200 hover:text-black',
                                'px-3 py-2 rounded-md text-sm font-medium',
                                ]"
                                >{{item.name}}
                                </router-link>
                            </div>
                        </div>
                        <div class="hidden-md:block">
                            <div class="ml-4 flex items-center md:ml-6">
                                <button 
                                    @click="logout"
                                    class="text-gray-500 hover:bg-red-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                                >log out</button>
                                <!-- todo: profile dropdown -->
                            </div>
                        </div>
                        
                    </div>
                </div>
            </nav>
        </header>
        <router-view :key="$route.path"></router-view>

        <Notification />
    </main>
</template>

<script setup>

import { useAccountStore } from '../stores/account.ts';
import { useRouter } from 'vue-router';
import Notification from './Notification.vue';
import {computed} from 'vue';

const router = useRouter();
const account = useAccountStore();
const path = computed(() => router.path)

const navigation = [
    { name: "Ingredients", to: "/ingredients"},
    { name: "Formulas", to: "/formulas"},
    { name: "Profile", to: "/profile"}
]

const logout = () => {
    account.logout()
    router.push("/login");
}

</script>