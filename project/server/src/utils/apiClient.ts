import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

export default {
    getIncomingCallEnter({ StoreId, SystemId }) {
        return apiClient.get('/NewInboundCall/WaitingToConnect', {
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