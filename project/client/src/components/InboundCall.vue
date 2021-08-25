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
                  <a-form-item
                    label="Phone Number To"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(phoneNumberTo)]"
                      v-model="phoneNumberTo"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Call Forwarding #"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(callForwardingNumber)]"
                      v-model="callForwardingNumber"
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
          <a-form-item
            label="Phone Number To"
            style="display: block; text-align: left"
          >
            <input :class="['ant-input']" v-model="selectedConfig.phoneNumberTo" />
          </a-form-item>
          <a-form-item
            label="Call Forwarding Number"
            style="display: block; text-align: left"
          >
            <input :class="['ant-input']" v-model="selectedConfig.callForwardingNumber" />
          </a-form-item>
        </a-modal>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import EventService from "../services/EventService.ts";
import { EditOutlined } from "@ant-design/icons-vue";

export default {
  components: { EditOutlined },
  data() {
    return {
      from: null,
      to: null,
      hasError: false,
      callerId: null,
      phoneNumberTo: null,
      callForwardingNumber: null,
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
          title: "Phone Number To",
          dataIndex: "phoneNumberTo",
          key: "phoneNumberTo",
        },
        {
          title: "Call Forwarding Number",
          dataIndex: "callForwardingNumber",
          key: "callForwardingNumber",
        },
        {
          title: "Action",
          slots: { customRender: "action" },
        },
      ],
      modleVisibility: false,
      selectedConfig: {
        callerId: null,
        phoneNumberTo: null,
        callForwardingNumber: null,
      },
    };
  },
  methods: {
    editConfig(val) {
      this.selectedConfig.callerId = null;
      this.selectedConfig.phoneNumberTo = null;
      this.selectedConfig.callForwardingNumber = null;
      EventService.getInboundCallConfigById(val.id).then((res) => {
        if (res.status === 200) {
          this.modleVisibility = true;
          const { callerId, phoneNumberTo, callForwardingNumber } = res.data;
          this.selectedConfig.callerId = callerId;
          this.selectedConfig.phoneNumberTo = phoneNumberTo;
          this.selectedConfig.callForwardingNumber = callForwardingNumber;
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
      if (!this.phoneNumberTo || !this.callerId || !this.callForwardingNumber) {
        this.hasError = true;
        return;
      }
      this.hasError = false;
      const params = {
        phoneNumberTo: this.phoneNumberTo,
        callerId: this.callerId,
        callForwardingNumber: this.callForwardingNumber,
      };
      console.log("inbound call params: ", params);
      EventService.addInboundCallConfig(params).then((res) => {
        console.log("RESPONSE: ", res);
        if (res.status === 201) {
          this.phoneNumberTo = null;
          this.callerId = null;
          this.callForwardingNumber = null;
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