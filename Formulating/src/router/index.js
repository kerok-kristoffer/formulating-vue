import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../components/DefaultLayout.vue'
import ProfileView from '../views/ProfileView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import FormulasView from '../views/FormulasView.vue'
import { useAccountStore } from '../stores/account'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      meta:{
        requiresAuth: true
      },
      children: [
        {path: '/profile', name: 'profile', component: ProfileView},
        {path: '/formulas', name: 'formulas', component: FormulasView,},
        {path: '/ingredients', name: 'ingredients', component: IngredientsView}
      ]
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
