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
            }
        }
    } as CDR,
    getters: {
        getCallDetailRecords: (state: CDR): CDRItem[] => state.Data.items,
        getCallDetailPager: (state: CDR): CDRPager => state.Data.meta
    },
    mutations: {
        setCallDetailRecords(state: CDR, payload: CDR) {
                const { items, meta } = payload.Data;
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
        }
    },
    actions: {
        getCallDetailRecords({ commit }: { commit: Commit }, params: any) {
            return HTTP().get('api/call-detail-record/getCdrLogs', { params: params }).then(res => {
                if (res.data.Status === Status.OK) {
                    //commit('setCallDetailRecords', res.data.Data);
                    commit('setCallDetailRecords', cdrData);
                }
            })
        },
        getCallDetailById({ commit }: { commit: Commit }, params: any) {
            return HTTP().get('api/call-detail-record/getCDRById', { params: params });
        }
    }
}