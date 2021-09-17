import { HTTP } from '../../axios/httpClient';
import { Commit } from 'vuex';
import { Status } from '../status';

import { CallRecording} from '../../types/callRecording';
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
    } as CallRecording,
    getters: {},
    mutations: {
        setCallRecordings(state: CallRecording, payload: CallRecording) {
                state.Data.items = [];
                console.log('setCallRecordings: ', payload)
        }
    },
    actions: {
        getCallRecordings({ commit }: { commit: Commit }, params: any) {
            return HTTP.get('/call-recording/getCallRecordings', { params: params }).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setCallRecordings', res.data.Data);
                }
            })
        }
    }
}