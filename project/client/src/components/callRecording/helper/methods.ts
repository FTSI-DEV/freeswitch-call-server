import { useStore } from 'vuex';

export default function methodsObj() {
    const store = useStore();
    
    const getCallRecordings = () => {
        store.dispatch("getCallRecordings", { page: 1, limit: 10 });
    }

    return {
        getCallRecordings
    }

}