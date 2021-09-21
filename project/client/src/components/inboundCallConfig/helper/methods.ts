import columnArray from './helper';
import { reactive, computed } from "vue";
import { useStore } from 'vuex';
import { Status } from '../../../store/status';
export default function methodsObj() {
    const store = useStore();
    const state = reactive({
        from: null,
        to: null,
        hasError: false,
        callerId: null,
        webhookUrl: null,
        httpMethod: "GET",
        isSaved: false,
        isServerError: false,
        modleVisibility: false,
        columns: columnArray,
        selectedConfig: {
          callerId: "",
          webhookUrl: "",
          httpMethod: "GET",
          id: ""
        },
      })

      const selectedHttpMethod = computed((): string => state.httpMethod === "POST" ? "HTTP POST" : "HTTP GET");
      
      // Methods
      const deleteConfig = (val: any) => {
        if (confirm("Are you sure you want to delete this config?")) {
          store.dispatch("deleteInboundCallConfig", val.id);
        }
      }
      const editConfig = (val: any) => {
        state.selectedConfig.callerId = "";
        state.selectedConfig.webhookUrl = "";
        store.dispatch("getInboundCallConfigById", val.id).then((res) => {
            if (res.data.Status === Status.OK) {
              const { callerId, webhookUrl, httpMethod, id } = res.data.Data;
              state.modleVisibility = true
              state.selectedConfig.callerId = callerId;
              state.selectedConfig.webhookUrl = webhookUrl;
              state.selectedConfig.httpMethod = httpMethod || "GET";
              state.selectedConfig.id = id
            }
        });
      }
      const handleOk = () => {
        store.dispatch("updateInboundCallConfig", state.selectedConfig).then(res => {
          if (res.data.Status === Status.OK) {  
            getInboundCallConfigs();
            state.modleVisibility = false;
          }
        });
      }
      const isInvalid = (value: string): string => !value && state.hasError ? "invalid" : "";
      const saveConfig = () => {
        if (!state.callerId || !state.webhookUrl) {
          state.hasError = true;
          return;
        }
        state.hasError = false;
        const params = {
          callerId: state.callerId,
          webhookUrl: state.webhookUrl,
          httpMethod: state.httpMethod
        };
        store.dispatch("addInboundCallConfig", params).then(res => {
            state.callerId = null;
            state.webhookUrl = null;
            state.isSaved = true;
        });
      }
  
  
      const getInboundCallConfigs = () => store.dispatch("getInboundCallConfigs");
      const setMethodUpdate = (val: string) => state.selectedConfig.httpMethod = val;
      const setMethod = (val: string) => state.httpMethod = val;
      const fetchInitialData = () => {
        getInboundCallConfigs();
      }

      return {
        state,
        deleteConfig,
        editConfig,
        handleOk,
        isInvalid,
        saveConfig,
        setMethodUpdate,
        setMethod,
        fetchInitialData,
        selectedHttpMethod
      }
}