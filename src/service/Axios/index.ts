import axios from 'axios';
import jsCookie from 'js-cookie';
import { TokenKey } from '@/constant/index';

const instance = axios.create({
    baseURL: '/api',
    timeout: 10000
});

instance.interceptors.request.use(config => {
    const token = jsCookie.get(TokenKey);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response.data;
}, error => {
    return Promise.reject(error);
});
export default instance;