import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';
import { Status } from '../status';
import { 
    InboundConfigItem, 
    InboundConfigPager, 
    InboundConfig 
} from '../../types/InbounCallConfig'

export default {
    state: {
        Data: {
            items : [],
            meta: {
                currentPage: 1,
                itemCount: 1,
                itemsPerPage: 1,
                totalItems: 1
            }
        },
        Message: "",
        Status: "",
        inboundConfigById: {
            callerId: "",
            httpMethod: "",
            webhookUrl: "",
            id: 1,
        }
    } as InboundConfig,
    getters: {
        inboundCallConfigData: (state: InboundConfig): InboundConfigItem[] => state.Data.items,
        inboundCallConfigPager: (state: InboundConfig): InboundConfigPager => state.Data.meta,
        inboundConfigById: (state: InboundConfig): InboundConfigItem => state.inboundConfigById
    },
    mutations: {    
        setInboundCallConfig(state: InboundConfig, payload: InboundConfig) {
            const { items, meta } = payload.Data;
            const { currentPage, itemCount, itemsPerPage , totalItems  } = meta;

            state.Data.items = [];
            state.Data.meta.currentPage = currentPage;
            state.Data.meta.itemCount = itemCount;
            state.Data.meta.itemsPerPage = itemsPerPage;
            state.Data.meta.totalItems = totalItems;
            items.forEach(prop => {
                state.Data.items.push({
                    callerId: prop.callerId,
                    httpMethod: prop.httpMethod,
                    webhookUrl: prop.webhookUrl,
                    id: prop.id,
                });
            });
        },
        setInboundConfigById(state: InboundConfig, payload: InboundConfigItem) {
            const { callerId, httpMethod, webhookUrl, id } = payload;
            state.inboundConfigById.id = id;
            state.inboundConfigById.callerId = callerId;
            state.inboundConfigById.httpMethod = httpMethod || "GET";
            state.inboundConfigById.webhookUrl = webhookUrl;
        }
    },
    actions: {
        getInboundCallConfigs({ commit }: { commit: Commit }, params: any) {
          return HTTP(params.authToken).get(`/api/inbound-call-config/getInboundCallConfigs`).then(res => {
            if (res.data.Status === Status.OK) {
                commit('setInboundCallConfig', res.data);
            }
          })
        },
        getInboundCallConfigById({commit}: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get(`/api/inbound-call-config/getInboundCallConfigById/${params.params}`)
        },
        addInboundCallConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            console.log('params: ', params)
            return HTTP(params.authToken).post('/api/inbound-call-config/add', params.params)
                .then(res => {
                    if (res.status === 201) {
                        dispatch("getInboundCallConfigs", { authToken: params.authToken });
                    }
            })
        },
        deleteInboundCallConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP(params.authToken).post(`/api/inbound-call-config/delete/${Number(params.params)}`)
                .then(res => {
                    if (res.status === 201) {
                        dispatch("getInboundCallConfigs", { authToken: params.authToken });
                    }
                });
        },
        updateInboundCallConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP(params.authToken).post('/api/inbound-call-config/update', params.params);
        },
        createInboundRulesConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP(params.authToken).post('/api/inbound-rules-config/createInboundConfig', params.params);
        },
        getInboundRulesConfig({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get('/api/inbound-rules-config/getInboundConfigs', {
                params: {
                    page: 1,
                    limit: 50
                }
            });
        },
        getCallTypes({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get('/api/inbound-rules-config/getCallTypes')
        }
    }
}