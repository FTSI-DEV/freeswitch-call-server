import api from 'ant-design-vue/lib/notification';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://www.freeswitchcallapp.com',
    // baseURL: 'http://localhost:3000',
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
    addPhoneNumberConfig(params:any){
        return apiClient.post('/freeswitch-phonenumber-config/add', params);
    },
    updatePhoneNumberConfig(params:any){
        return apiClient.post('/freeswitch-phonenumber-config/update', params);
    },
    clickToCall(params: any) {
        console.log('params: ', params);
        return apiClient.post(`/freeswitch/clickToCall/${params.phoneNumberFrom}/${params.phoneNumberTo}/${params.callerId}`, );
    },
    getInboundCallConfig(params: any) {
        return apiClient.get(`/api/inbound-call-config/getInboundCallConfig`, { params: params });
    },
    addInboundCallConfig(params: any) {
        console.log('params: ', params)
        return apiClient.post(`/api/inbound-call-config/add/${params.phoneNumberTo}/${params.callerId}/${params.callForwardingNumber}`);
    },
    updateInboundCallConfig(params: any) {
        return apiClient.post(`/api/inbound-call-config/${params.phoneNumberTo}/${params.callerId}/${params.callForwardingNumber}`);
    }
}