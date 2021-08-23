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
              <div class="call-config">Inbound Call</div>
              <a-row>
                <a-col :span="6" style="margin-right: 20px">
                  <a-form-item label="From">
                    <input class="ant-input" v-model="from" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="To" style="margin-right: 20px">
                    <input class="ant-input" v-model="to" />
                  </a-form-item>
                </a-col>
                <a-col :span="6" style="margin-right: 20px">
                  <a-form-item label="Caller Id">
                    <input class="ant-input" v-model="callerId" />
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
    };
  },

  methods: {
    clickToCall() {
      const params = {
        phoneNumberFrom: this.from,
        phoneNumberTo: this.to,
        callerId: this.callerId,
      };
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
</style>