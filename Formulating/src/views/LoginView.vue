<template>
  <main class="login">
    <div class="mx-14 flex flex-col mt-80">
      <section class="forms bg-slate-100 p-12 h-40">
        <div class="flex flex-row ">
          <form class="login" @submit.prevent="submit">
            <h2 class="font-semibold mx-2">Login</h2>
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
              class="bg-slate-200 h-8 mx-2 px-2 rounded-md"
              value="Login"
              type="submit"
            >
          </form>
        </div>
        <div class="flex flex-row mx-14 mt-4 py-2">
          <p class="my-1">Not registered?</p>
          <RouterLink class="bg-slate-200 h-8 mx-2 px-2 rounded-md py-1" to="register">register</RouterLink>
        </div>
      </section>

    </div>
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
      
      const account = useAccountStore()
      account.login(data.user, data.access_token, data.refresh_token);
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
    display: flex;
    align-items: center;
  }
}
</style>




