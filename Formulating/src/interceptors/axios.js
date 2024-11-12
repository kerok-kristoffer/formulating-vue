import axios from 'axios'
import router from '../router'
import { useAccountStore } from '@/stores/account'
import {userData} from "@/stores/userData";

axios.defaults.baseURL = import.meta.env.VITE_API_URL
let refresh = false

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const account = useAccountStore()

    if (error.response.status === 401 && !refresh) {
      if (userData().debug) {
        console.log('attempting to catch 401 and update refresh token')
      }
      refresh = true
      const refreshToken = account.refreshToken

      try {
        const { status, data } = await axios.post('tokens/renew', { refresh_token: refreshToken })

        if (status === 200) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
          account.notify('Token updated, resending original request...', 'success')

          // Resend the original request
          const originalRequest = error.config
          originalRequest.headers['Authorization'] = axios.defaults.headers.common['Authorization']

          return axios(originalRequest)
        } else {
          if (userData().debug) {
            console.log('status on first token renew not 200, status: ' + status)
          }
          router.push('/login')
        }
      } catch (error) {
        if (userData().debug) {
          console.log('caught some error while getting renew token: ' + error)
        }
        router.push('/login')
      }
    } else {
      if (error.response.status) {
        // todo add interpretation to messages and show to users
        if (userData().debug) {
          console.log('printing error...')
        }

        if (error.response.data) {
          // account.notify(error.response.data)
        } else {
          if (userData().debug) {
            console.log(error)
          }
        }
      }
    }

    refresh = false
    return Promise.reject(error)
  }
)