import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://www.freeswitchcallapp.com/api',
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
        console.log('params: ', params);
        return apiClient.post(`/freeswitch/clickToCall?phoneNumberFrom=${params.phoneNumberFrom}&phoneNumberTo=${params.phoneNumberTo}&callerId=${params.callerId}`);
    }
}