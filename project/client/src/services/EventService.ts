import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://freeswitchcall.com/',
    withCredentials: false,
    headers: {
        // crossdomain: true ,
        Accept: 'application/json',
        // "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
    },
    // proxy: {
    //     host: 'http://localhost',
    //     port: 3000
    // }
});

export default {
    getCallConfigById(params: any) {
        return apiClient.get('/freeswitch-call-config', {
            params: params,
        });
    },
    saveRecord(params: any) {
        return apiClient.post(`/freeswitch-call-config`, params);
    },
    clickToCall(params: any) {
        return apiClient.post(`/freeswitch/clickToCall`, params);
    }
}