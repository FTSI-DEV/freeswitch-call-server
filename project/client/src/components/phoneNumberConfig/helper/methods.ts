import { reactive, computed } from 'vue';
import ColumnArray from './helper';
import { useStore } from 'vuex';

export default function methodsObj() {
    const authToken = localStorage.getItem("fs_auth_token");
    const store = useStore();
    const state = reactive({
        friendlyName: null,
        phoneNumber: null,
        httpMethod: "POST",
        webhookURL: null,
        accountId: null,
        from: null,
        to: null,
        callerId: null,
        hasError: false,
        isSaved: false,
        isServerError: false,
        columns: ColumnArray,
        modleVisibility: false,
        selectedConfig: {
          friendlyName: null,
          phoneNumber: null,
          httpMethod: "GET",
          webhookUrl: null,
          accountId: null
        },
      });
  
      const selectedHttpMethod = computed((): string => state.httpMethod === "POST" ? "HTTP POST" : "HTTP GET");
  
      const setMethodUpdate = (val: string) => state.selectedConfig.httpMethod = val;
      const getPhoneNumberConfigs = () => store.dispatch('getPhoneNumberConfigs', { authToken });
      const deleteConfig = (val: any) => {
        if (confirm("Are you sure you want to delete this config?")) {
          store.dispatch("deletePhoneNumberConfig", { params: val.id, authToken });
        }
      }
      const editConfig = (val: any) => {
        state.selectedConfig.friendlyName = null;
        state.selectedConfig.phoneNumber = null;
        state.selectedConfig.webhookUrl = null;
        store.dispatch("getPhoneNumberConfigById", { params: val.id , authToken}).then((res) => {
            const { friendlyName, phoneNumber, httpMethod, webhookUrl, accountId } = res.data;
            state.modleVisibility = true;
            state.selectedConfig.friendlyName = friendlyName;
            state.selectedConfig.phoneNumber = phoneNumber;
            state.selectedConfig.httpMethod = httpMethod || "GET";
            state.selectedConfig.webhookUrl = webhookUrl;
            state.selectedConfig.accountId = accountId;
        });
      }
      const handleOk = (): void => {
        store.dispatch('updatePhoneNumberConfig', { params: state.selectedConfig, authToken }).then((res) => {
           state.modleVisibility = false;
        });
      }
      const isInvalid = (value: string): string =>  !value && state.hasError ? "invalid" : "";
      const setMethod = (val: string) => state.httpMethod = val;
      const saveConfig = () => {
        if (
          !state.accountId ||
          !state.friendlyName ||
          !state.phoneNumber ||
          !state.httpMethod ||
          !state.webhookURL
        ) {
          state.hasError = true;
          return;
        }
        state.hasError = false;
        const params = {
          friendlyName: state.friendlyName,
          phoneNumber: state.phoneNumber,
          httpMethod: state.httpMethod,
          webhookUrl: state.webhookURL,
          accountId: Number(state.accountId),
        };
        store.dispatch('addPhoneNumberConfig', { params, authToken }).then((res) => {
          state.friendlyName = null;
          state.phoneNumber = null;
          state.webhookURL = null;
          state.accountId = null;
          state.isSaved = true;
        });
      }

      return {
        state,
        selectedHttpMethod,
        setMethodUpdate,
        getPhoneNumberConfigs,
        deleteConfig,
        handleOk,
        editConfig,
        isInvalid,
        setMethod,
        saveConfig,
      }
}