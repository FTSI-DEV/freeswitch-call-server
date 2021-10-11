import { HTTP } from '../../axios/httpClient';
import { Commit } from 'vuex';
import { Status } from '../status';
import { CDR, CDRItem, CDRPager } from '../../types/callDetailRecords';
import { cdrData } from '../mock/mockData';
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
                Id: 1,
                PhoneNumberTo: "",
                PhoneNumberFrom: "",
                CallStatus: "",
                CallUUID: "",
                Duration: "",
                DateCreated: "",
                RecordingUUID: "",
                CallDirection: "",
                ParentCallUid: "",
            }
        },
    } as CDR,
    getters: {
        getCallDetailRecords: (state: CDR): CDRItem[] => state.Data.items,
        getCallDetailPager: (state: CDR): CDRPager => state.Data.meta,
        getCallDetail: (state: CDR): CDRItem => state.Data.detail
    },
    mutations: {
        setCallDetailRecords(state: CDR, payload: any) {
                console.log('payload: ', payload);
                const { items, meta } = payload;
                state.Data.items = [];
                
                state.Data.meta.totalItems = meta.totalItems;
                state.Data.meta.itemCount = meta.itemCount;
                state.Data.meta.itemsPerPage = meta.itemsPerPage;
                state.Data.meta.totalPages = meta.totalPages;
                state.Data.meta.currentPage = meta.currentPage;

                items.forEach((prop: CDRItem)  => {
                    state.Data.items.push({
                        Id: prop.Id,
                        PhoneNumberTo: prop.PhoneNumberTo,
                        PhoneNumberFrom: prop.PhoneNumberFrom,
                        CallStatus: prop.CallStatus,
                        Duration: prop.Duration,
                        DateCreated: prop.DateCreated,
                        CallDirection: prop.CallDirection,
                        CallUUID: prop.CallUUID,
                        RecordingUUID: prop.RecordingUUID,
                        ParentCallUid: prop.ParentCallUid
                    })
                });
        },
        setCallRecordDetail(state: CDR, payload: CDRItem) {
            state.Data.detail = payload;
        }
    },
    actions: {
        getCallDetailRecords({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get('api/call-detail-record/getCdrLogs', { params: params }).then(res => {
                if (res.data.Status === Status.OK) {
                    //commit('setCallDetailRecords', res.data.Data);
                    commit('setCallDetailRecords',  res.data.Data);
                }
            })
        },
        getCallDetailById({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).get(`api/call-detail-record/getCDRById/${params.params}`).then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setCallRecordDetail',  res.data.Data);
                }
            })
        }
    }
}