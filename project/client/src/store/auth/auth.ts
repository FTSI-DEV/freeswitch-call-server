import { HTTP } from '../../axios/httpClient';
import { Commit, Dispatch } from 'vuex';

export default {
    actions: {
        loginUser({ commit }: { commit: Commit }, params: any) {
            return HTTP().post("api/auth/loginUser", params)
        },
        registerUser({ commit }: { commit: Commit }, params: any) {
            return HTTP().post("api/auth/register", params)
        },
    }
}