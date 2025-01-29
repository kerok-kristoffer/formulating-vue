import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../components/DefaultLayout.vue'
import ProfileView from '../views/ProfileView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import FormulasView from '../views/FormulasView.vue'
import SubscriptionsView from '../views/SubscriptionView.vue'
import SuccessView from '../views/SubscriptionSuccessPage.vue'
import { globalState } from '@/main'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import RenewPasswordView from '@/views/RenewPasswordView.vue'
import { useAuthStore } from '@/stores/auth'
import ExitSurveyView from '@/views/ExitSurvey.vue'
import {userData} from "@/stores/userData";
import BetaLandingPage from "@/views/BetaLandingPage.vue";
import FaqPage from "@/views/FaqPage.vue";
import FreeCalculatorView from "@/views/FreeCalculatorView.vue";

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
      path: '/free',
      name: 'free',
      component: FreeCalculatorView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/beta',
      name: 'beta',
      component: BetaLandingPage
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqPage
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
  if (userData().debug) {
    console.log('attempting re-authentication')
  }
  try {
    await authStore.reAuthenticate()

    if (authStore.token !== null) {
      globalState.isAuthenticated = true
      next()
    } else {
      if (userData().debug) {
        console.log('re-authentication attempt failed')
      }
      globalState.isAuthenticated = false
      next({ name: 'Login' })
    }
  } catch (error) {
    if (userData().debug) {
      console.log('re-authentication attempt failed')
    }
    globalState.isAuthenticated = false
    router.push('/login')
  }
}

router.beforeEach(async (to, from, next) => {
  if (userData().debug) {
    console.log('Navigation guard triggered', {
      to: to.path,
      from: from.path,
      isAuthenticated: globalState.isAuthenticated
    })
  }
  if (
      (to.name === 'Login' || to.name === 'register') &&
      globalState.isAuthenticated
  ) {
    if (userData().debug) {
      console.log('Redirecting to /formulas from router: ' + to.name)
    }
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
  if (userData().debug) {
    console.log('Proceeding to next route')
  }
  next()
})


router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('config', 'YOUR_GA_MEASUREMENT_ID', {
      page_path: to.fullPath,
    });
  }
});

export default router
