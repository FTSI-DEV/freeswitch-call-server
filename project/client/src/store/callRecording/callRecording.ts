import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';
import { Status } from '../status';
import { CallRecording, CallRecordingItem, RecordingDetail } from '../../types/callRecording';
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
            },
            detail: {
                CallUUID: "",
                DateCreated: "",
                FilePath: "",
                IsDeleted: false,
                RecordingId: 1,
                RecordingUUID: "",
            }
        }
    } as CallRecording,
    getters: {
        getCallRecordings: (state: CallRecording): CallRecordingItem[] => state.Data.items,
        getCallRecordingDetail: (state: CallRecording): RecordingDetail => state.Data.detail
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
        },
        setCallRecord(state: CallRecording, payload: RecordingDetail) {
            state.Data.detail = payload;
        }
    },
    actions: {
        getCallRecordings({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get('/api/call-recording/getCallRecordings', { params: params.params }).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setCallRecordings', res.data);
                }
            });
        },
        getCallRecord({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get(`/api/call-recording/getCallRecord/${params.params}`);
        },
        getRecordFile({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get('/api/call-recording/getRecordFile', { params: params.params });
        },
        deleteCallRecording({ dispatch }: { dispatch: Dispatch }, params: any) {
            return HTTP(params.authToken).get('/api/call-recording/deleteCallRecording', { params: params.params }).then(res => {
                if (res.data.Status === Status.OK) {
                    dispatch('getCallRecordings', { page: 1, limit: 1 });
                }
            });
        },
        setCallRecord({ commit }: { commit: Commit }, payload: any) {
            commit('setCallRecord', payload);
        }
    }
}