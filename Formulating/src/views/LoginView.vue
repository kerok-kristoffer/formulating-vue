<template>
  <main class="login">
    <section class="forms">
      <form class="login" @submit.prevent="submit">
        <h2>Login</h2>
        <input
          placeholder="UserName"
          type="text"
          name="userName"
        >
        <input
          placeholder="Password"
          type="password"
          name="Password"
        />
        <input
          value="Login"
          type="submit"
        >
      </form>
    </section>
    <RouterLink to="register">register</RouterLink>
  </main>

</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/account";


 export default {
  name: "Login",
  setup () {
    const router = useRouter();

    const submit = async e => {
      const form = new FormData(e.target);
      const inputs = Object.fromEntries(form.entries());

      axios.defaults.headers.common['Authorization'] = `Bearer `

      const {data} = await axios.post('users/login', inputs, {
        withCredentials: true
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
      
      const account = useAccountStore()
      account.login(data.user);
      
      await router.push('/');
    }

    return {
      submit
    }
  }
 }
</script>

<style>
@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>




