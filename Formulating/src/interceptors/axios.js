import axios from "axios";
import router from "../router";
import { useAccountStore } from '../stores/account';

//axios.defaults.baseURL = 'https://api.kerok.se';
axios.defaults.baseURL = 'http://localhost:8080';
let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    const account = useAccountStore()
    if (error.response.status === 401 && !refresh) {
        
        let refreshToken = account.refreshToken

        refresh = true;
        const {status, data} = await axios.post('tokens/renew', {refresh_token: refreshToken});

        if (status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
            return axios(error.config)    
        } else {
            router.push("/login")
        }
    } else {
        if (error.response.status) {
            // todo add interpretation to messages and show to users
            account.notify(error.response.data)
        }
    }
    refresh = false;
    return error;

});