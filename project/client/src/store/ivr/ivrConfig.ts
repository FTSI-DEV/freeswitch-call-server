import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';
import { Status } from '../status';

interface IVRConfig {
    ivrScript: string;
    welcomeMessage: string;
    welcomeRecordUrl: string;
    failedRetryMessage: string;
    failedMessage: string;
    redirectCallMessage: string;
    preRedirectCallMessage: string;
    wrongInputRetryMessage: string;
    ivrRetryCount: string;
}

export default {
    state: {
        ivrConfig: {
            ivrScript: "",
            welcomeMessage: "",
            welcomeRecordUrl: "",
            failedRetryMessage: "",
            failedMessage: "",
            redirectCallMessage: "",
            preRedirectCallMessage: "",
            wrongInputRetryMessage: "",
            ivrRetryCount: ""
        } as IVRConfig,
    }, 
    getters: {},
    mutations: {
        setIVRConfig(state: IVRConfig, payload: IVRConfig) {
            console.log('setIVRConfig payload: ', payload);
        }
    },
    actions: {
        getIVRConfig({ commit }: { commit: Commit }) {
            return HTTP.get('/api/freeswitch-phonenumber-config/getIVRConfig').then(res => {
                if (res.data.Status === Status.OK) {
                    commit('setIVRConfig', res.data.Data);
                }
            })
        },
        saveIVRConfig({ commit }: { commit: Commit }) {
            return HTTP.get('/api/freeswitch-phonenumber-config/saveIVRConfig');
        }
    }
}