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
        <b-row v-if="configList">
          <b-col>
            <a-table :dataSource="configList.list" :columns="columns">
              <template #action="{ record }">
                <a title="Edit" @click="editConfig(record)"
                  ><EditOutlined style="font-size: 1.2em"
                /></a>
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
<script>
import EventService from "../services/EventService.ts";
import { EditOutlined, DownOutlined } from "@ant-design/icons-vue";

export default {
  components: { EditOutlined , DownOutlined },
  data() {
    return {
      from: null,
      to: null,
      hasError: false,
      callerId: null,
      webhookUrl: null,
      httpMethod: "POST",
      isSaved: false,
      isServerError: false,
      configList: null,
      columns: [
        {
          title: "Caller Id",
          dataIndex: "callerId",
          key: "callerId",
        },
        {
          title: "HTTP Method",
          dataIndex: "httpMethod",
          key: "httpMethod"
        },
        {
          title: "Webhook URL",
          dataIndex: "webhookUrl",
          key: "webhookUrl",
        },
        {
          title: "Action",
          slots: { customRender: "action" },
        },
      ],
      modleVisibility: false,
      selectedConfig: {
        callerId: null,
        webhookUrl: null,
        httpMethod: "GET"
      },
    };
  },
  computed: {
    selectedHttpMethod(){
      return this.httpMethod === "POST" ? "HTTP POST" : "HTTP GET";
    }
  },
  methods: {
    editConfig(val) {
      this.selectedConfig.callerId = null;
      this.selectedConfig.webhookUrl = null;
      EventService.getInboundCallConfigById(val.id).then((res) => {
        if (res.status === 200) {
          this.modleVisibility = true;
          const { callerId, webhookUrl, httpMethod } = res.data;
          this.selectedConfig.callerId = callerId;
          this.selectedConfig.webhookUrl = webhookUrl;
          this.selectedConfig.httpMethod = httpMethod || "GET";
        }
      });
    },
    handleOk() {
      EventService.updateInboundCallConfig(this.selectedConfig).then(res => {
        if (res.status === 201) {
          this.getInboundCallConfigs();
          this.modleVisibility = false;
        }
      });
    },
    isInvalid(value) {
      return !value && this.hasError ? "invalid" : "";
    },
    saveConfig() {
      if (!this.callerId || !this.webhookUrl) {
        this.hasError = true;
        return;
      }
      this.hasError = false;
      const params = {
        callerId: this.callerId,
        webhookUrl: this.webhookUrl,
        httpMethod: this.httpMethod
      };
      console.log("inbound call params: ", params);
      EventService.addInboundCallConfig(params).then((res) => {
        console.log("RESPONSE: ", res);
        if (res.status === 201) {
          this.callerId = null;
          this.webhookUrl = null;
          this.isSaved = true;
          this.getInboundCallConfigs();
        } else {
          this.isServerError = true;
        }
      });
    },
    getInboundCallConfigs() {
      EventService.getInboundCallConfigs().then((res) => {
        if (res.status) {
          this.configList = {
            list: res.data.items,
            pager: res.data.meta,
          };
        }
      });
    },
    setMethodUpdate(val){
      this.selectedConfig.httpMethod = val;
    },
     setMethod(val) {
      this.httpMethod = val;
    },
  },
  created() {
    this.getInboundCallConfigs();
  },
};
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