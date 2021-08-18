import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://www.freeswitchcallapp.com/',
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
        return apiClient.get('/freeswitch-call-config/getCallConfigById', {
            params: params,
        });
    },
    saveRecord(params: any) {
        return apiClient.post(`/freeswitch-call-config/saveRecord`, params);
    },
    clickToCall(params: any) {
        return apiClient.post(`/freeswitch/clickToCall2`, params);
    }
}