import axios from 'axios';
const https = require('https');

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    // httpsAgent: new https.Agent({  
    //     rejectUnauthorized: false,
    //     keepAlive: true
    // })
});

export default {
    getIncomingCallEnter({ StoreId, SystemId }) {
        console.log('StoreId: ', StoreId);
        console.log('SystemId: ', SystemId);
        return apiClient.get('/NewInboundCall/IncomingCallEnter', {
            params: { StoreId, SystemId }
        })
    },
    getIncomingCallVerify({ StoreId, SystemId }) {
        return apiClient.get('/NewInboundCall/IncomingCallVerify', {
            params: { StoreId, SystemId }
        })
    },
    getWaitingToConnect({ StoreId, SystemId }) {
        return apiClient.get('/NewInboundCall/WaitingToConnect', {
            params: { StoreId, SystemId }
        })
    },
}