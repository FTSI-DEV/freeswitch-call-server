import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';
import { Status } from '../status';
import { CallRecording, CallRecordingItem } from '../../types/callRecording';
import { callRecording } from '../mock/mockData';

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
    getters: {
        getCallRecordings: (state: CallRecording): CallRecordingItem[] => state.Data.items
    },
    mutations: {
        setCallRecordings(state: CallRecording, payload: CallRecording) {
                const { items, meta } = payload.Data;
            
                state.Data.items = [];
                state.Data.meta.totalItems = meta.totalItems;
                state.Data.meta.itemCount = meta.itemCount;
                state.Data.meta.itemsPerPage = meta.itemsPerPage;
                state.Data.meta.totalPages = meta.totalPages;
                state.Data.meta.currentPage = meta.currentPage;

                items.forEach((prop: CallRecordingItem) => {
                    state.Data.items.push({
                        RecordingId: prop.RecordingId,
                        RecordingUUID: prop.RecordingUUID,
                        CallUUID: prop.CallUUID,
                        FilePath: prop.FilePath,
                        IsDeleted: prop.IsDeleted,
                        DateCreated: prop.DateCreated,
                        CallId: prop.CallId,
                        Duration: "30 sec"
                    })
                });
        }
    },
    actions: {
        getCallRecordings({ commit }: { commit: Commit }, params: any) {
            return HTTP.get('/api/call-recording/getCallRecordings', { params: params }).then(res => {
                if (res.data.Status === Status.OK) {
                   // commit('setCallRecordings', res.data.Data);
                    commit('setCallRecordings', callRecording);
                }
            });
        },
        getCallRecord({ commit }: { commit: Commit }, params: any) {
            return HTTP.get('/api/call-recording/getCallRecord', { params: params });
        },
        getRecordFile({ commit }: { commit: Commit }, params: any) {
            return HTTP.get('/api/call-recording/getRecordFile', { params: params });
        },
        deleteCallRecording({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP.get('/api/call-recording/deleteCallRecording', { params: params }).then(res => {
                if (res.data.Status === Status.OK) {
                    dispatch('getCallRecordings', { page: 1, limit: 1 });
                }
            });
        }
    }
}