import { HTTP } from '../../axios/httpClient';
import { Commit } from 'vuex';

interface ClickToCall {
    phoneNumberFrom: string;
    phoneNumberTo: string;
    callerId: string;
}

export default {
    actions: {
        clickToCall({ commit }: { commit: Commit }, params: any) {
            return HTTP(params.authToken).post('/api/outbound-call/clickToCall', params.params);
        }
    }
}