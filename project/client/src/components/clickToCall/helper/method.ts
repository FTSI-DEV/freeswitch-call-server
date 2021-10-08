import { useStore } from "vuex";
import { reactive } from "vue";

export default function methodsObj() {
    const store = useStore();
    const state = reactive({
        from: null,
        to: null,
        callerId: null,
        hasError: false,
    });

    // Methods
    const isInvalid = (value: string): string =>
        !value && state.hasError ? "invalid" : "";
    const clickToCall = () => {
        if (!state.from || !state.to || !state.callerId) {
            state.hasError = true;
            return;
        }
        state.hasError = false;
        const params = {
            phoneNumberFrom: state.from,
            phoneNumberTo: state.to,
            displayCallerId: state.callerId,
        };
        const authToken = localStorage.getItem("fs_auth_token");
        store.dispatch("clickToCall", {
            authToken,
            params
        });
    };

    return {
        isInvalid,
        state,
        clickToCall
    }
}