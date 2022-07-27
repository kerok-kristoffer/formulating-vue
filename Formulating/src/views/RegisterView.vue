<template>
  <main class="register">
    <section class="forms">
      <form class="register" @submit.prevent="submit">
        <h2>Register</h2>
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
          value="Register"
          type="submit"
        />
      </form>
    </section>
    <RouterLink to="login">login</RouterLink>
  </main>
</template>

<script>
  import axios from 'axios';
  import { useRouter } from "vue-router";

 export default {
  name: "Login",
  setup () {
    const router = useRouter();

    const submit = async e => {
      const form = new FormData(e.target);

      const inputs = Object.fromEntries(form.entries());

      await axios.post('users', inputs);
      await router.push('/login');
    }
    
    return {
      submit
    } 
  }
 }
 </script>

<style>
@media (min-width: 1024px) {
  .register {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
