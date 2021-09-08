import axios from 'axios';

export const HTTP = axios.create({
    // baseURL: 'http://www.freeswitchcallapp.com',
    baseURL: 'http://localhost:3000',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});