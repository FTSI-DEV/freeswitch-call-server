import { useStore } from 'vuex';
import { useRouter } from "vue-router";
export default function methodsObj() {
    const store = useStore();
    const router = useRouter();
    const authToken = localStorage.getItem("fs_auth_token");
    const getCallDetailRecords = () => {
        store.dispatch("getCallDetailRecords", { params: { page: 1, limit: 10 }, authToken }).catch((err) => {
            console.log(err);
            router.replace("/dashboard");
        });
    }
    const viewDetails = (item: any) => {
        store.dispatch("getCallDetailById", { params: item.Id, authToken});
    };
    return {
        getCallDetailRecords,
        viewDetails
    }

}