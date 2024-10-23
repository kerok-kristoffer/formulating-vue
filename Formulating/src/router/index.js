import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../components/DefaultLayout.vue'
import ProfileView from '../views/ProfileView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import FormulasView from '../views/FormulasView.vue'
import SubscriptionsView from '../views/SubscriptionView.vue'
import SuccessView from '../views/SubscriptionSuccessPage.vue'
import CancelView from '../views/SubscriptionCancelPage.vue'
import { globalState } from '@/main'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import RenewPasswordView from '@/views/RenewPasswordView.vue'
import { useAuthStore } from '@/stores/auth'
import ExitSurveyView from '@/views/ExitSurvey.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/user',
      component: DefaultLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        { path: '/profile', name: 'profile', component: ProfileView },
        { path: '/formulas', name: 'formulas', component: FormulasView },
        { path: '/ingredients', name: 'ingredients', component: IngredientsView },
        { path: '/plans', name: 'plans', component: SubscriptionsView }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView
    },
    {
      path: '/renew-password',
      name: 'renew-password',
      component: RenewPasswordView
    },
    { path: '/success', name: 'subSuccess', component: SuccessView },
    { path: '/exitSurvey', name: 'exitSurvey', component: ExitSurveyView },
  ]
})

async function attemptReauth(next) {
  const authStore = useAuthStore()
  console.log('attempting re-authentication')
  try {
    await authStore.reAuthenticate()

    if (authStore.token !== null) {
      globalState.isAuthenticated = true
      next()
    } else {
      console.log('re-authentication attempt failed')
      globalState.isAuthenticated = false
      next({ name: 'Login' })
    }
  } catch (error) {
    console.log('re-authentication attempt failed')
    globalState.isAuthenticated = false
    router.push('/login')
  }
}

router.beforeEach(async (to, from, next) => {
  console.log('Navigation guard triggered', {
    to: to.path,
    from: from.path,
    isAuthenticated: globalState.isAuthenticated
  })
  if (
      (to.name === 'Login' || to.name === 'register') &&
      globalState.isAuthenticated
  ) {
    console.log('Redirecting to /formulas from router: ' + to.name)
    next('/formulas')
    return
  }

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    globalState.isAuthenticated !== true
  ) {
    await attemptReauth(next)
    return
  }

  console.log('Proceeding to next route')
  next()
})

export default router
