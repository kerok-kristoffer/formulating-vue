<template>
  <main class="register">
    <div class="mx-14 flex flex-col mt-80">
      <section class="forms bg-slate-100 p-12 h-40">
        <div class="flex flex-row ">
          <form class="register" @submit.prevent="submit">
            <h2 class="font-semibold mx-2">Register</h2>
            <input
              placeholder="User Name"
              type="text"
              name="userName"
            />
            <input
              placeholder="example@mail.com"
              type="email"
              name="email"
            />
            <input
              placeholder="Full Name"
              type="text"
              name="fullname"
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
            />
            <input
              class="bg-slate-200 h-8 mx-2 px-2 rounded-md"
              value="Register"
              type="submit"
            />
          </form>
        </div>
        <div class="flex flex-row mx-14 mt-4 py-2">
          <p class="my-1">Already registered?</p>
          <RouterLink class="bg-slate-200 h-8 mx-2 px-2 rounded-md py-1" to="login">login</RouterLink>
        </div>
      </section>

    </div>

    
  
    <div class="">
      <Notification />
    </div>
  </main>
</template>

<script>
  import axios from 'axios';
  import { useRouter } from "vue-router";
  import { useAccountStore } from '../stores/account';
import Notification from '../components/Notification.vue';


 export default {
    name: "Login",
    setup() {
        const router = useRouter();
        const submit = async (e) => {
            const form = new FormData(e.target);
            const inputs = Object.fromEntries(form.entries());
            const account = useAccountStore();
            axios.post("users", inputs).then((response) => {
                // account.login()
                if (response.status === 200) {
                    router.push("/login"); // todo kerok - login automatically and push to "/"
                }
            });
        };
        return {
            submit
        };
    },
    components: { Notification }
}
 </script>

<style>
@media (min-width: 1024px) {
  .register {

    display: flex;
    align-items: center;
  }
}
</style>
