import api from 'ant-design-vue/lib/notification';
import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'http://www.freeswitchcallapp.com',
    baseURL: 'http://localhost:3000',
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
    addPhoneNumberConfig(params:any){
        return apiClient.post('/api/freeswitch-phonenumber-config/add', params);
    },
    updatePhoneNumberConfig(params:any){
        return apiClient.post('/api/freeswitch-phonenumber-config/update', params);
    },
    getPhoneNumberConfigs(params:any){
        return apiClient.get('/api/freeswitch-phonenumber-config/getPhonenumberConfigs');
    },
    deletePhoneNumberConfig(params:any){
        return apiClient.post(`/api/freeswitch-phonenumber-config/deleteConfig/${params}`);
    },  
    getPhoneNumberConfigById(params:any){
        return apiClient.get('/api/freeswitch-phonenumber-config/getPhoneNumberConfigById', { params: params });
    },
    clickToCall(params: any) {
        return apiClient.post(`/api/outbound-call/clickToCall/${params.phoneNumberFrom}/${params.phoneNumberTo}/${params.callerId}`, );
    },
    getInboundCallConfigs(params: any) {
        return apiClient.get(`/api/inbound-call-config/getInboundCallConfigs`);
    },
    getInboundCallConfigById(params: any) {
        return apiClient.get(`/api/inbound-call-config/getInboundCallConfigById/${params}`);
    },
    addInboundCallConfig(params: any) {
        return apiClient.post(`/api/inbound-call-config/add/${params.callerId}/${params.webhookUrl}/${params.httpMethod}`);
    },
    deleteInboundCallConfig(params:any){
        return apiClient.post(`/api/inbound-call-config/deleteConfig/${params}`);
    }, 
    updateInboundCallConfig(params: any) {
        return apiClient.post(`/api/inbound-call-config/${params.phoneNumberTo}/${params.callerId}/${params.callForwardingNumber}`);
    }
}