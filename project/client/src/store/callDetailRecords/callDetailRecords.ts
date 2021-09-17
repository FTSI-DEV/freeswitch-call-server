import { HTTP } from '../../axios/httpClient';
import { Commit } from 'vuex';
import { Status } from '../status';

import { CDR } from '../../types/callDetailRecords';
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
    } as CDR,
    getters: {},
    mutations: {
        setCallDetailRecords(state: CDR, payload: CDR) {
                state.Data.items = [];
                console.log('setCallDetailRecords: ', payload)
        }
    },
    actions: {
        getCallDetailRecords({ commit }: { commit: Commit }, params: any) {
            return HTTP.get('/call-detail-record/getCdrLogs', { params: params }).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setCallDetailRecords', res.data.Data);
                }
            })
        }
    }
}