<script setup>
  import {onMounted, ref} from "vue";
  import { useAccountStore } from '../stores/account';
  import axios from 'axios';
import { storeToRefs } from "pinia";

    const user = ref("");
    const account = useAccountStore();
    onMounted(async () => {
      user.value = account.user;
    });

    const refreshToken = () => {
      axios.post('tokens/renew', {refresh_token: account.refreshToken})
        .then(response => {
          console.log(response.data)

          if (response.status === 200) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
              account.notify("Token refreshed", "success")
          } else {
            account.notify(response.statusText)
          }
      });
    }
</script>

<template>
  <div class="flex flex-col w-1/2 mx-auto">
    <div class="flex flex-row h-96"></div>
    <div class="profile bg-slate-200 p-3 rounded-md">
        <h1 class="text-lg font-bold">Profile</h1>
        <h2>Hello {{ user.fullName }}</h2>
        <p>{{ user.email }}</p>
        <p>Member since: {{ user.created_at }}</p>
        <button @click="refreshToken" 
          class="
            hidden
          bg-slate-400 
            px-2 
            hover:bg-slate-300 
            my-2 
            rounded-md 
            font-semibold">refreshToken</button>
    </div>
  </div>
</template>