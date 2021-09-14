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
        items: [],
        meta: {
            currentPage: 1,
            itemCount: 1,
            itemsPerPage: 1,
            totalItems: 1
        },
        inboundConfigById: {
            callerId: "",
            httpMethod: "",
            webhookUrl: "",
            id: 1,
        }
    } as InboundConfig,
    getters: {
        inboundCallConfigData: (state: InboundConfig): Array<InboundConfigItem> => state.items,
        inboundCallConfigPager: (state: InboundConfig): InboundConfigPager => state.meta,
        inboundConfigById: (state: InboundConfig): InboundConfigItem => state.inboundConfigById
    },
    mutations: {    
        setInboundCallConfig(state: InboundConfig, payload: InboundConfig) {
            const { items, meta } = payload;
            const { currentPage, itemCount, itemsPerPage , totalItems  } = meta;

            state.items = [];
            state.meta.currentPage = currentPage;
            state.meta.itemCount = itemCount;
            state.meta.itemsPerPage = itemsPerPage;
            state.meta.totalItems = totalItems;

            items.forEach(prop => {
                state.items.push({
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
        getInboundCallConfigs({ commit }: { commit: Commit }) {
          return HTTP.get(`/api/inbound-call-config/getInboundCallConfigs`).then(res => {
            if (res.status === Status.OK) {
                commit('setInboundCallConfig', res.data);
            }
          })
        },
        getInboundCallConfigById({commit}: { commit: Commit }, params: number) {
            return HTTP.get(`/api/inbound-call-config/getInboundCallConfigById/${params}`)
            // .then(res => {
            //     if (res.status === Status.OK) {
            //         commit("setInboundConfigById", res.data);
            //     }
            // });
        },
        addInboundCallConfig({ dispatch }: { dispatch: Dispatch }, params: InboundConfigItem) {
            console.log('params: ', params)
            return HTTP.post('/api/inbound-call-config/add', params)
                .then(res => {
                    if (res.status === 201) {
                        dispatch("getInboundCallConfigs");
                    }
            })
        },
        deleteInboundCallConfig({ dispatch }: { dispatch: Dispatch }, params: number) {
            return HTTP.post(`/api/inbound-call-config/deleteConfig/${params}`)
                .then(res => {
                    if (res.status === Status.OK) {
                        dispatch("getInboundCallConfigs");
                    }
                });
        },
        updateInboundCallConfig({ dispatch }: { dispatch: Dispatch }, params: InboundConfigItem) {
            return HTTP.post(`/api/inbound-call-config/${params.callerId}/${params.webhookUrl}/${params.httpMethod}`);
        }
    }
}