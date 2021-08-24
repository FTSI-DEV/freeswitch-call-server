import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://www.freeswitchcallapp.com/api',
    //baseURL: 'http://localhost:3000/',
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
        return apiClient.get('/api/freeswitch-call-config/getCallConfigById', {
            params: params,
        });
    },
    saveRecord(params: any) {
        return apiClient.post(`/api/freeswitch-call-config/saveRecord`, params);
    },
    clickToCall(params: any) {
        console.log('params: ', params);
        return apiClient.post(`/api/freeswitch/clickToCall`, params);
    },
    getInboundCallConfig(params: any) {
        return apiClient.get(`/api/freeswitch/getInboundCallConfig`, { params: params });
    },
    addInboundCallConfig(params: any) {
        return apiClient.post(`/api/freeswitch/add`, params);
    },
    updateInboundCallConfig(params: any) {
        return apiClient.post(`/api/freeswitch/update`, params);
    }
}