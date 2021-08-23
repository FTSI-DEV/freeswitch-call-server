<template>
  <a-layout>
    <a-layout style="padding: 24px 24px 24px">

        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
    <a-row>
      <a-col :span="10">
        <div style="background: white; padding: 20px;">
          <div class="call-config">Config</div>
          <a-form-item label="Friendly Name">
            <input class="ant-input" v-model="friendlyName" />
          </a-form-item>
          <a-form-item label="Phone Number">
            <!-- <a-input-number v-model="phoneNumber" style="width: 100%" /> -->
            <input class="ant-input" v-model="phoneNumber" />
          </a-form-item>
          <a-form-item label="HTTP Method">
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
          <a-form-item label="Webhook URL">
            <!-- <a-input v-model="webhookURL" /> -->
            <input class="ant-input" v-model="webhookURL" />
          </a-form-item>
          <a-form-item style="text-align: left">
            <a-button type="primary" @click="saveConfig"> Save </a-button>
          </a-form-item>
        </div>
      </a-col>
    </a-row>
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
    };
  },
  computed: {
    selectedHttpMethod() {
      return this.httpMethod === "POST" ? "HTTP POST" : "HTTP GET";
    },
  },
  methods: {
    setMethod(val) {
      this.httpMethod = val;
    },
    saveConfig() {
      console.log("saveConfig: ");
      const params = {
        friendlyName: this.friendlyName,
        phoneNumber: this.phoneNumber,
        httpMethod: this.httpMethod,
        webhookUrl: this.webhookURL,
      };
      EventService.saveRecord(params).then((res) => {
        console.log("Save config return: ", res);
      });
      console.log(params);
    },
    clickToCall() {
      const params = {
        phoneNumberFrom: this.from,
        phoneNumberTo: this.to,
        callerId: this.callerId,
      };
      EventService.clickToCall(params);
      console.log("params: ", params);
    },
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
</style>