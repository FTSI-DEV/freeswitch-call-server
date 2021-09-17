import { reactive, computed } from 'vue';
import ColumnArray from './helper';
import { useStore } from 'vuex';

export default function methodsObj() {
    const store = useStore();
    const state = reactive({
        friendlyName: null,
        phoneNumber: null,
        httpMethod: "POST",
        webhookURL: null,
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
        },
      });
  
      const selectedHttpMethod = computed((): string => state.httpMethod === "POST" ? "HTTP POST" : "HTTP GET");
  
      const setMethodUpdate = (val: string) => state.selectedConfig.httpMethod = val;
      const getPhoneNumberConfigs = () => store.dispatch('getPhoneNumberConfigs');
      const deleteConfig = (val: any) => {
        if (confirm("Are you sure you want to delete this config?")) {
          store.dispatch("deletePhoneNumberConfig", val.id);
        }
      }
      const editConfig = (val: any) => {
        state.selectedConfig.friendlyName = null;
        state.selectedConfig.phoneNumber = null;
        state.selectedConfig.webhookUrl = null;
        store.dispatch("getPhoneNumberConfigById", { id: val.id }).then((res) => {
            const { friendlyName, phoneNumber, httpMethod, webhookUrl } = res.data;
            state.modleVisibility = true;
            state.selectedConfig.friendlyName = friendlyName;
            state.selectedConfig.phoneNumber = phoneNumber;
            state.selectedConfig.httpMethod = httpMethod || "GET";
            state.selectedConfig.webhookUrl = webhookUrl;
        });
      }
      const handleOk = (): void => {
        store.dispatch('updatePhoneNumberConfig', state.selectedConfig).then((res) => {
           state.modleVisibility = false;
        });
      }
      const isInvalid = (value: string): string =>  !value && state.hasError ? "invalid" : "";
      const setMethod = (val: string) => state.httpMethod = val;
      const saveConfig = () => {
        if (
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
        };
        store.dispatch('addPhoneNumberConfig', params).then((res) => {
          state.friendlyName = null;
          state.phoneNumber = null;
          state.webhookURL = null;
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