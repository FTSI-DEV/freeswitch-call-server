<template>
  <a-layout>
    <a-layout style="padding: 24px 24px 24px">
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          margin: 0,
          minHeight: '280px',
        }"
      >
        <a-row>
          <a-col>
            <div style="padding: 20px">
              <div class="call-config">Inbound Call Config</div>
              <a-alert
                v-if="isSaved && !hasError"
                message="Successfully saved"
                type="success"
                style="text-align: left; margin-bottom: 5px"
              />
              <a-aler
                v-if="isServerError"
                message="Error"
                type="error"
                style="text-align: left; margin-bottom: 5px"
              />
              <a-row>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Caller Id"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(callerId)]"
                      v-model="callerId"
                    />
                  </a-form-item>
                </a-col>

                <a-col style="margin-right: 15px">
                    <a-form-item label="HTTP Method" style="display: block; text-align: left">
                      <a-dropdown>
                        <template #overlay>
                          <a-menu>
                              <a-menu-item key="1" @click="setMethod('POST')">
                                HTTP POST
                              </a-menu-item>
                              <a-menu-item key="2" @click="setMethod('GET')">
                              HTTP GET
                              </a-menu-item>
                          </a-menu>
                        </template>
                         <a-button style="width: 100%; text-align: left">
                          {{ selectedHttpMethod }}
                          <DownOutlined style="float: right; margin-top: 5px" />
                         </a-button>
                      </a-dropdown>
                    </a-form-item>
                </a-col>

                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Webhook Url"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(webhookUrl)]"
                      v-model="webhookUrl"
                    />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item style="text-align: left">
                    <a-button
                      type="primary"
                      @click="saveConfig"
                      style="margin-top: 32px"
                    >
                      Save
                    </a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
        <b-row v-if="inboundCallConfigData.length">
          <b-col>
            <a-table :dataSource="inboundCallConfigData" :columns="columns">
              <template #action="{ record }">
                <a title="Edit" @click="editConfig(record)"
                  ><EditOutlined style="font-size: 1.2em; margin-right: 15px"
                /></a>
                 <a title="Delete" @click="deleteConfig(record)">
                  <DeleteOutlined style="font-size: 1.2em" />
                </a>
              </template>
            </a-table>
          </b-col>
        </b-row>
        <a-modal
          v-model:visible="modleVisibility"
          title="Edit Config"
          ok-text="Save"
          @ok="handleOk"
        >
          <a-form-item
            label="Caller Id"
            style="display: block; text-align: left"
          >
            <input :class="['ant-input']" v-model="selectedConfig.callerId"/>
          </a-form-item>

          <a-form-item label="HTTP Method" style="display: block; text-align: left">
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                     <a-menu-item key="1" @click="setMethodUpdate('POST')">
                            HTTP POST
                     </a-menu-item>
                     <a-menu-item key="2" @click="setMethodUpdate('GET')">
                            HTTP GET
                     </a-menu-item>
                  </a-menu>
                </template>
                 <a-button style="width: 100%; text-align: left">
                        {{ selectedConfig.httpMethod }}
                        <DownOutlined style="float: right; margin-top: 5px" />
                </a-button>
              </a-dropdown>
          </a-form-item>

          <a-form-item
            label="Webhook URL"
            style="display: block; text-align: left"
          >
            <input :class="['ant-input']" v-model="selectedConfig.webhookUrl" />
          </a-form-item>
        </a-modal>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { useStore } from 'vuex';
import { computed, defineComponent, toRefs, reactive } from "vue";
import { EditOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import columnArray from './helper';

export default defineComponent({
  components: { EditOutlined , DownOutlined, DeleteOutlined},
  setup() {
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
        callerId: null,
        webhookUrl: null,
        httpMethod: "GET"
      },
    })

    // Computed
    const selectedHttpMethod = computed((): string => state.httpMethod === "POST" ? "HTTP POST" : "HTTP GET");
    const inboundCallConfigData = computed((): any => store.getters['inboundCallConfigData']);
    const inboundCallConfigById = computed((): any => store.getters['inboundConfigById']);

    // Methods
    const deleteConfig = (val: any) => {
      if (confirm("Are you sure you want to delete this config?")) {
        store.dispatch("deleteInboundCallConfig", val.id);
      }
    }
    const editConfig = (val: any) => {
      state.selectedConfig.callerId = null;
      state.selectedConfig.webhookUrl = null;
      store.dispatch("getInboundCallConfigById", val.id).then(() => {
          state.modleVisibility = true
          state.selectedConfig.callerId = inboundCallConfigById.value.callerId;
          state.selectedConfig.webhookUrl = inboundCallConfigById.value.webhookUrl;
          state.selectedConfig.httpMethod = inboundCallConfigById.value.httpMethod || "GET";
      });
    }
    const handleOk = () => {
      store.dispatch("updateInboundCallConfig", state.selectedConfig).then(res => {
        state.modleVisibility = false;
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
    
    fetchInitialData();

    return {
      ...toRefs(state),
      selectedHttpMethod,
      inboundCallConfigData,
      inboundCallConfigById,
      editConfig,
      deleteConfig,
      isInvalid,
      handleOk,
      saveConfig,
      getInboundCallConfigs,
      setMethodUpdate,
      setMethod,
      fetchInitialData
    }
  }
});
</script>
<style scoped>
.call-config {
  text-align: left;
  font-size: 2em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.invalid {
  border: 1px solid red;
}
</style>