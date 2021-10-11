import { useStore } from 'vuex';
import { useRouter } from "vue-router";
export default function methodsObj() {
    const store = useStore();
    const router = useRouter();
    const getCallDetailRecords = () => {
        store.dispatch("getCallDetailRecords", { page: 1, limit: 10 }).catch((err) => {
            console.log(err);
            router.replace("/dashboard");
          });
    }

    return {
        getCallDetailRecords
    }

}