import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import FormulasView from '../views/FormulasView.vue'
import { useAccountStore } from '../stores/account'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import('../components/sandbox/sandbox.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/formulas',
      name: 'formulas',
      component: FormulasView,
      meta:{
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const account = useAccountStore()
  if (to.path === '/login' && account.user) {
    next('/')
    return;
  }

  if  (to.matched.some(record => record.meta.requiresAuth) && !account.user) {
    next('/login')
    return;
  }

  next();
})
export default router
