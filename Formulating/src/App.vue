<template>
  <main>
    <header>
        <nav v-if="account.user" class="relative container mx-auto p-6">
        <div class="flex items-center justify-between">
          <div class="pt-2">
            <p>mySatchel</p>
          </div>
          <div class="hidden md:flex space-x-6">
            <RouterLink to="/about">Ingredients</RouterLink>
            <RouterLink to="/profile">Profile</RouterLink>
            <RouterLink to="/">About</RouterLink>
            <RouterLink to="/formulas">Formulas</RouterLink>
            <RouterLink to="/login" @click="logout">logout</RouterLink>
          </div>
        </div>
        </nav>
        <nav v-else>
          <RouterLink to="/register">Register</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
        </nav>
    </header>

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
@import '@/assets/base.css';
@import '@/assets/tailwind.css';

main {
  max-width: 100%;
  min-width: 1024px;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  background: #fff;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  background: #eee;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
