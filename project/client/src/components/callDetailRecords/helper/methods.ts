import { useStore } from 'vuex';

export default function methodsObj() {
    const store = useStore();
    
    const getCallDetailRecords = () => {
        store.dispatch("getCallDetailRecords", { page: 1, limit: 10 });
    }

    return {
        getCallDetailRecords
    }

}