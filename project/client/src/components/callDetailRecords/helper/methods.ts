import { useStore } from 'vuex';
import { useRouter } from "vue-router";
export default function methodsObj() {
    const store = useStore();
    const router = useRouter();
    const getCallDetailRecords = () => {
        const authToken = localStorage.getItem("fs_auth_token");
        store.dispatch("getCallDetailRecords", { params: { page: 1, limit: 10 }, authToken }).catch((err) => {
            console.log(err);
            router.replace("/dashboard");
          });
    }

    return {
        getCallDetailRecords
    }

}