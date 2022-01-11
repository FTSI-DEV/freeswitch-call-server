import columnArray from './helper';
import { reactive, computed } from "vue";
import { useStore } from 'vuex';
import { Status } from '../../../store/status';
export default function methodsObj() {
    const authToken = localStorage.getItem("fs_auth_token");
    const store = useStore();
    const state = reactive({
        from: null,
        to: null,
        hasError: false,
        callerId: null,
        accountId: null,
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
          id: "",
          accountId: null
        },
        callType: 2
      })
      const setCallType = (val: any) => {
        if (val === 'ivr') {
          state.callType = 1;
        } else {
          state.callType = 2;
        }
      }
      const selectedHttpMethod = computed((): string => state.httpMethod === "POST" ? "HTTP POST" : "HTTP GET");
      const selectedCallType = computed((): string => state.callType === 1 ? "IVR" : "Inbound");
      // Methods
      const deleteConfig = (val: any) => {
        if (confirm("Are you sure you want to delete this config?")) {
          store.dispatch("deleteInboundCallConfig", { params: val.id, authToken });
        }
      }
      const editConfig = (val: any) => {
        state.selectedConfig.callerId = "";
        state.selectedConfig.webhookUrl = "";
        store.dispatch("getInboundCallConfigById", { params: val.id, authToken }).then((res) => {
            if (res.data.Status === Status.OK) {
              const { callerId, webhookUrl, httpMethod, id, accountId } = res.data.Data;
              state.modleVisibility = true
              state.selectedConfig.callerId = callerId;
              state.selectedConfig.webhookUrl = webhookUrl;
              state.selectedConfig.httpMethod = httpMethod || "GET";
              state.selectedConfig.id = id;
              state.selectedConfig.accountId = accountId;
            }
        });
      }
      const handleOk = () => {
        store.dispatch("updateInboundCallConfig", { params: state.selectedConfig, authToken }).then(res => {
          if (res.data.Status === Status.OK) {  
            getInboundCallConfigs();
            state.modleVisibility = false;
          }
        });
      }
      const isInvalid = (value: string): string => !value && state.hasError ? "invalid" : "";
      const saveConfig = () => {
        if (!state.callerId || !state.webhookUrl || !state.accountId) {
          state.hasError = true;
          return;
        }
        state.hasError = false;
        const params = {
          callerId: state.callerId,
          webhookUrl: state.webhookUrl,
          httpMethod: state.httpMethod,
          accountId: Number(state.accountId),
          callTypeId: 2,
          ivrOptions: {
            ivrScript: null,
            welcomeMessage: null,
            welcomeRecordUrl: null,
            failedRetryMessage: null,
            failedMessage: null,
            redirectMessage: null,
            wrongInputRetryMessage: null,
            ivrRetryCount: null,
            preRedirectMessage: null,
            ivrOptions: []
          }
        };
        store.dispatch("createInboundRulesConfig", { params, authToken }).then(res => {
            state.callerId = null;
            state.webhookUrl = null;
            state.accountId = null;
            state.isSaved = true;
        });
      }

      const getInboundRuleConfig = () => {
        store.dispatch("getCallTypes", { authToken });
        store.dispatch("getInboundRulesConfig", { authToken }).then(res => {
          console.log(res)
        });
      }

  
      const getInboundCallConfigs = () => store.dispatch("getInboundCallConfigs", { authToken });
      const setMethodUpdate = (val: string) => state.selectedConfig.httpMethod = val;
      const setMethod = (val: string) => state.httpMethod = val;
      const fetchInitialData = () => {
        getInboundCallConfigs();
        getInboundRuleConfig();
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
        selectedHttpMethod,
        getInboundRuleConfig,
        setCallType,
        selectedCallType
      }
}