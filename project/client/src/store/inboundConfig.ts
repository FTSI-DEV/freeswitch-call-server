import { Commit } from 'vuex';

interface stateProp {
    count: number
}

export default {
    state() {
        return {
            count: 0
        } as stateProp
    },
    mutations: {
        increment(state: stateProp, payload: number) {
            console.log('payload: ', payload);
            state.count++;
        }
    },
    actions: {
        increment({ commit }: { commit: Commit }, payload: number) {
            commit('increment', payload);
        }
    }
}