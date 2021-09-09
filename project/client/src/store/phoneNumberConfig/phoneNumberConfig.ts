import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';
import { Status } from '../status';
import { 
    PhoneNumberConfigPager,
    PhoneNumberConfigItem,
    PhoneNumberConfig
} from '../../types/phoneNumberConfig';

export default {
    state() {
        return {
            items: [],
            meta: {
                currentPage: 1,
                itemCount: 1,
                itemsPerPage: 1,
                totalItems: 1,
                totalPages: 1,
            },
            phoneConfigById: {
                friendlyName: "",
                httpMethod:"",
                id: 1,
                phoneNumber: "",
                webhookUrl: "",
            }
        } as PhoneNumberConfig
    },
    getters: {
        getPhoneNumberConfig: (state: PhoneNumberConfig): Array<PhoneNumberConfigItem> => state.items,
        getPhoneNumberPager: (state: PhoneNumberConfig): PhoneNumberConfigPager => state.meta,
        getPhoneNumberConfigById: (state: PhoneNumberConfig): PhoneNumberConfigItem => state.phoneConfigById,
    },
    mutations: {
        setPhoneNumberConfigs(state: PhoneNumberConfig, payload: PhoneNumberConfig) {
            const { items, meta } = payload;
            const { currentPage, itemCount, itemsPerPage, totalItems, totalPages } = meta;

            state.meta.currentPage = currentPage;
            state.meta.itemCount = itemCount;
            state.meta.itemsPerPage = itemsPerPage;
            state.meta.totalItems = totalItems;
            state.meta.totalPages = totalPages;
            state.items = [];

            items.forEach(prop => {
                state.items.push({
                    friendlyName: prop.friendlyName,
                    httpMethod: prop.httpMethod,
                    id: prop.id,
                    phoneNumber: prop.phoneNumber,
                    webhookUrl: prop.friendlyName,
                });
            });
        },
        setPhoneNumberConfigById(state: PhoneNumberConfig, payload: PhoneNumberConfigItem) {
            const { friendlyName, httpMethod, id, phoneNumber, webhookUrl } = payload;
            state.phoneConfigById.id = id;
            state.phoneConfigById.friendlyName = friendlyName;
            state.phoneConfigById.httpMethod = httpMethod;
            state.phoneConfigById.phoneNumber = phoneNumber;
            state.phoneConfigById.webhookUrl = webhookUrl;
            console.log('state.phoneConfigById: ', state.phoneConfigById);
        }
    },
    actions: {
        getPhoneNumberConfigs({ commit }: { commit: Commit }) {
            return HTTP.get('/api/freeswitch-phonenumber-config/getPhonenumberConfigs').then(res => {
                if (res.status === Status.OK) {
                    commit('setPhoneNumberConfigs', res.data);
                }
            });
        },
        getPhoneNumberConfigById({ commit }: { commit: Commit }, params: any) {
            return HTTP.get(`/api/freeswitch-phonenumber-config/getPhoneNumberConfigById/${params.id}`)
            //     .then(res => {
            //         if (res.status === Status.OK) {
            //             commit('setPhoneNumberConfigById', res.data)
            //         }
            // });
        },
        addPhoneNumberConfig({ dispatch }: { dispatch: Dispatch }, params: PhoneNumberConfigItem) {
            return HTTP.post('/api/freeswitch-phonenumber-config/add', params).then(res => {
                if (res.status === 201) {
                    dispatch('getPhoneNumberConfigs');
                }
            });
        },
        updatePhoneNumberConfig({ dispatch }: { dispatch: Dispatch }, params: PhoneNumberConfigItem){
            return HTTP.post('/api/freeswitch-phonenumber-config/update', params).then(res => {
                 if (res.status === 201) {
                    dispatch('getPhoneNumberConfigs');
                }
            });
        },
        deletePhoneNumberConfig({ dispatch }: { dispatch: Dispatch }, params: number) {
            return HTTP.post(`/api/freeswitch-phonenumber-config/deleteConfig/${params}`).then(res => {
                if (res.status === Status.OK) {
                    dispatch('getPhoneNumberConfigs');
                }
            });
        },
    }
}