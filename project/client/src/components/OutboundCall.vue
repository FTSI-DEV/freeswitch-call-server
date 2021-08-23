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
              <div class="call-config">Outbound Call</div>
              <a-row>
                <a-col :span="6" style="margin-right: 20px">
                  <a-form-item label="From">
                    <input
                      :class="['ant-input', isInvalid(from)]"
                      v-model="from"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="To" style="margin-right: 20px">
                    <input :class="['ant-input', isInvalid(to)]" v-model="to" />
                  </a-form-item>
                </a-col>
                <a-col :span="6" style="margin-right: 20px">
                  <a-form-item label="Caller Id">
                    <input
                      :class="['ant-input', isInvalid(callerId)]"
                      v-model="callerId"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="3" style="position: relative">
                  <a-button
                    type="danger"
                    @click="clickToCall"
                    style="position: absolute; right: 0px; top: 32px"
                  >
                    Call
                  </a-button>
                </a-col>
              </a-row>
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
    };
  },
  methods: {
    isInvalid(value) {
      return !value && this.hasError ? "invalid" : "";
    },
    clickToCall() {
      if (!this.from || !this.to || !this.callerId) {
        this.hasError = true;
        return;
      }
      this.hasError = false;
      const params = {
        phoneNumberFrom: this.from,
        phoneNumberTo: this.to,
        callerId: this.callerId,
      };
      console.log("click to call params: ", params);
      EventService.clickToCall(params);
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