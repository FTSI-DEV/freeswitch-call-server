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
            <div style="background: white; padding: 20px">
              <div class="call-config">Phone Number Config</div>
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
                    label="Friendly Name"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(friendlyName)]"
                      v-model="friendlyName"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Phone Number"
                    style="display: block; text-align: left"
                  >
                    <!-- <a-input-number v-model="phoneNumber" style="width: 100%" /> -->
                    <input
                      :class="['ant-input', isInvalid(phoneNumber)]"
                      v-model="phoneNumber"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="HTTP Method"
                    style="display: block; text-align: left"
                  >
                    <!-- <a-input v-model="httpMethod" /> -->
                    <!-- <input class="ant-input" v-model="httpMethod" /> -->
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
                    label="Webhook URL"
                    style="display: block; text-align: left"
                  >
                    <!-- <a-input v-model="webhookURL" /> -->
                    <input
                      :class="['ant-input', isInvalid(webhookURL)]"
                      v-model="webhookURL"
                    />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item style="text-align: left">
                    <a-button type="primary" @click="saveConfig" style="margin-top: 32px">
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
            <a-table :dataSource="configList.list" :columns="columns" />
          </b-col>
        </b-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import EventService from "../services/EventService.ts";
import { DownOutlined } from "@ant-design/icons-vue";
// import OutboundCall from './OutboundCall.vue';
export default {
  data() {
    return {
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
      configList: null,
      columns: [
        {
          title: "Friendly Name",
          dataIndex: "friendlyName",
          key: "friendlyName",
        },
        {
          title: "HTTP Method",
          dataIndex: "httpMethod",
          key: "httpMethod",
        },
        {
          title: "Phone Number",
          dataIndex: "phoneNumber",
          key: "phoneNumber",
        },
         {
          title: "Weebhook URL",
          dataIndex: "webhookUrl",
          key: "webhookUrl",
        },
      ],
    };
  },
  computed: {
    selectedHttpMethod() {
      return this.httpMethod === "POST" ? "HTTP POST" : "HTTP GET";
    },
  },
  methods: {
    isInvalid(value) {
      return !value && this.hasError ? "invalid" : "";
    },
    setMethod(val) {
      this.httpMethod = val;
    },
    saveConfig() {
      if (
        !this.friendlyName ||
        !this.phoneNumber ||
        !this.httpMethod ||
        !this.webhookURL
      ) {
        this.hasError = true;
        return;
      }

      this.hasError = false;

      const params = {
        friendlyName: this.friendlyName,
        phoneNumber: this.phoneNumber,
        httpMethod: this.httpMethod,
        webhookUrl: this.webhookURL,
      };
      console.log("saveConfig params:", params);

      EventService.addPhoneNumberConfig(params).then((res) => {
        console.log("RESPONSE: ", res);
        if (res.status === 201) {
          this.friendlyName = null;
          this.phoneNumber = null;
          this.webhookURL = null;
          this.isSaved = true;
          this.getPhoneNumberConfigs();
        } else {
          this.isServerError = true;
        }
      });
    },
    getPhoneNumberConfigs() {
      EventService.getPhoneNumberConfigs().then((res) => {
        if (res.status === 200) {
          
          this.configList = {
            list: res.data.items,
            pager: res.data.meta,
          };
        }
        console.log("configList: ", this.configList);
      });
    },
  },
  created() {
    this.getPhoneNumberConfigs();
  },
  components: { DownOutlined },
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