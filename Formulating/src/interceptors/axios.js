import axios from "axios";
import router from "../router";

//axios.defaults.baseURL = 'https://api.kerok.se';
// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = 'http://a761b033b94bd4a0fafb28192d044010-224995670.eu-north-1.elb.amazonaws.com';
// a761b033b94bd4a0fafb28192d044010-224995670.eu-north-1.elb.amazonaws.com
//axios.defaults.baseURL = 'http://a761b033b94bd4a0fafb28192d044010-224995670.eu-north-1.elb.amazonaws.com';


let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401) {
        router.push('/login')

        /*refresh = true;  // TODO kerok - implement this when backend refresh route is added!
        const {status, data} = await axios.post('refresh', {}, {
            withCredentials: true
        });

        if (status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            return axios(error.config)
        } */
    }
    refresh = false;
    return error;

});