<template>
  <main>
    <body>
        <RouterView />
    </body>
  </main>
  
</template>


<script>
import { useAccountStore } from './stores/account';
import { useRouter } from 'vue-router';

export default {
  
  setup() {
    const router = useRouter();
    const account = useAccountStore();

    const logout = () => {
      account.logout()
      router.push("/login");
    }
    
    return {
      account,
      logout
    }
  }

}

</script>

<style>
  @import './assets/base.css';
  @import './assets/tailwind.css';

</style>
