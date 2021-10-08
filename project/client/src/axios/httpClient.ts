import axios from 'axios';

export const HTTP = (token?: string) => {
    return axios.create({
        // baseURL: 'http://www.freeswitchcallapp.com',
        baseURL: 'http://localhost:3000',
        withCredentials: false,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
}