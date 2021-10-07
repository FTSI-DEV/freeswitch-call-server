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
            }
        }
    } as AccountConfig,
    getters: {
        getAccountConfigs: (state: AccountConfig): AccountConfigItem[] => state.Data.items
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
            console.log('Account Config Item: ', payload);
        }
    },
    actions: {
        getAccountConfigs({ commit }: { commit: Commit }, params: any) {
            commit("setAccountConfig", accountConfig);
            return HTTP.get('api/account-config/getAccountConfigs', params).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setAccountConfig', res.data);
                }
            });
        },
        getAccountConfigById({ commit }: { commit: Commit }, params: any) {
            return HTTP.get('api/account-config/getAccountConfigById', params).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setAccountConfigById', res.data);
                }
            });
        },
        addAccountConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP.post(`api/account-config/add/${params}`).then(res => {
                if (res.data.Status === Status.OK) {
                    dispatch('getAccountConfigs');
                }
            });
        },
        updateAccountConfig({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP.get('api/account-config/update', params).then(res => {
                if (res.data.Status === Status.OK) {
                    dispatch('getAccountConfigs');
                }
            });
        }
    }
}  