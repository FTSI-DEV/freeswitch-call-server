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
          <a-col :span="10">
            <div style="padding: 20px">
              <div class="call-config">Inbound Call Config</div>
              <a-alert v-if="isSaved && !hasError" message="Successfully saved" type="success" style="text-align: left; margin-bottom: 5px;"/>
              <a-aler v-if="isServerError" message="Error" type="error" style="text-align: left; margin-bottom: 5px;"/>
              <a-form-item label="Caller Id" style="display: block; text-align: left">
                <input
                  :class="['ant-input', isInvalid(callerId)]"
                  v-model="callerId"
                />
              </a-form-item>
              <a-form-item label="Phone # To" style="display: block; text-align: left">
                <input
                  :class="['ant-input', isInvalid(phoneNumberTo)]"
                  v-model="phoneNumberTo"
                />
              </a-form-item>
              <a-form-item label="Call Forwarding #" style="display: block; text-align: left">
                <input
                  :class="['ant-input', isInvalid(callForwardingNumber)]"
                  v-model="callForwardingNumber"
                />
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
export default {
  data() {
    return {
      from: null,
      to: null,
      callerId: null,
      hasError: false,
      phoneNumberTo: null,
      callForwardingNumber: null,
      isSaved: false,
      isServerError: false
    };
  },
  methods: {
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
        console.log('RESPONSE: ', res)
        if (res.status === 201) {
          this.phoneNumberTo = null;
          this.callerId = null;
          this.callForwardingNumber = null;
          this.isSaved = true;
        } else {
          this.isServerError = true;
        }
      })
    },
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