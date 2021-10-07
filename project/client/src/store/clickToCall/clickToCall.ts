import { HTTP } from '../../axios/httpClient';
import { Commit } from 'vuex';

interface ClickToCall {
    phoneNumberFrom: string;
    phoneNumberTo: string;
    callerId: string;
}

export default {
    actions: {
        clickToCall({ commit }: { commit: Commit }, params: ClickToCall) {
            return HTTP().post('/api/outbound-call/clickToCall', params);
        }
    }
}