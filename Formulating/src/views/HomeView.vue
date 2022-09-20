<template>
  <main>
    <h1>Hello {{ user.fullName }}</h1>


  </main>
</template>

<script>
import {onMounted, ref} from "vue";
import { useAccountStore } from '@/stores/account'



 export default {
    name: "Home",
    setup() {
        const user = ref("");
        const account = useAccountStore();
        onMounted(async () => {
            user.value = account.user;
        });
        return {
            user,
        };
    }
}
</script>
