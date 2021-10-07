import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';
import { Status } from '../status';
import { AccountConfig, AccountConfigItem } from "../../types/accountConfig";
import { accountConfig } from '../mock/mockData';

export default {
    state: {
        Data: {
            items: [],
            meta: {
                totalItems: 0,
                itemCount: 0,
                itemsPerPage: 1,
                totalPages: 0,
                currentPage: 1
            },
            configItem: {
                accountName: "",
                accountSID: "",
                authKey: "",
                authToken: "",
                dateCreted: "",
                isActive: false,
                id: 1
            }
        }
    } as AccountConfig,
    getters: {
        getAccountConfigs: (state: AccountConfig): AccountConfigItem[] => state.Data.items,
        getAccountConfigItem: (state: AccountConfig): AccountConfigItem => state.Data.configItem
    },
    mutations: {
        setAccountConfig(state: AccountConfig, payload: AccountConfig) {
            state.Data.items = [];

            payload.Data.items.forEach(prop => {
                state.Data.items.push({
                    id: prop.id,
                    accountSID: prop.accountSID,
                    accountName: prop.accountName,
                    authToken: prop.authToken,
                    dateCreted: prop.dateCreted,
                    isActive: prop.isActive,
                });
            });
            console.log('set account config: ', payload);
        },
        setAccountConfigById(state: AccountConfig, payload: AccountConfigItem) {
            const { accountName, accountSID, authKey, dateCreted, isActive, id } = payload;
            state.Data.configItem.accountName = accountName;
            state.Data.configItem.accountSID = accountSID;
            state.Data.configItem.authKey = authKey;
            state.Data.configItem.dateCreted = dateCreted;
            state.Data.configItem.isActive = isActive;
            state.Data.configItem.id = id;
        }
    },
    actions: {
        getAccountConfigs({ commit }: { commit: Commit }, params: any) {
            commit("setAccountConfig", accountConfig);
            return HTTP(params.authToken).get('api/account-config/getAccountConfigs', params.params).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setAccountConfig', res.data);
                }
            });
        },
        getAccountConfigById({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get(`api/account-config/getAccountConfigById/${params.id}`);
        },
        setAccountConfigData({ commit }: { commit: Commit }, payload: any) {
            commit('setAccountConfigById', payload);
        },
        addAccountConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP(params.authToken).post(`api/account-config/add/${params.accountName}`);
        },
        updateAccountConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP(params.authToken).post('api/account-config/update', params.params).then(res => {
                if (res.data.Status === Status.OK) {
                    dispatch('getAccountConfigs');
                }
            });
        }
    }
}  