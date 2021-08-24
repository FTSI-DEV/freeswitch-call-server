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
        return apiClient.get('/freeswitch-call-config/getCallConfigById', {
            params: params,
        });
    },
    saveRecord(params: any) {
        return apiClient.post(`/freeswitch-call-config/saveRecord`, params);
    },
    clickToCall(params: any) {
        console.log('params: ', params);
        return apiClient.post(`/freeswitch/clickToCall/${params.phoneNumberFrom}/${params.phoneNumberTo}/${params.callerId}`, );
    },
    getInboundCallConfig(params: any) {
        return apiClient.get(`/inbound-call-config/getInboundCallConfig`, { params: params });
    },
    addInboundCallConfig(params: any) {
        console.log('params: ', params)
        return apiClient.post(`/inbound-call-config/add/${params.phoneNumberTo}/${params.callerId}/${params.callForwardingNumber}`);
    },
    updateInboundCallConfig(params: any) {
        return apiClient.post(`/inbound-call-config/${params.phoneNumberTo}/${params.callerId}/${params.callForwardingNumber}`);
    }
}