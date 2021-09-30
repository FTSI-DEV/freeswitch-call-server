<template>
  <a-layout style="padding: 10px; background: #fff">
    <div class="call-config">
      <div style="text-align: left; flex: 1">Call Configuration</div>
    </div>

    <div
      :style="{
        padding: '10px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <a-tabs tabPosition="left">
        <a-tab-pane key="1" tab="Phone Number">
          <PhoneNumberConfig />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Inbound">
          <InboundCallConfig />
        </a-tab-pane>
        <a-tab-pane key="3" tab="IVR">
          <IVRConfig />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-layout>
</template>
<script>
import PhoneNumberConfig from "./phoneNumberConfig/PhoneNumberConfig";
import InboundCallConfig from "./inboundCallConfig/InboundCallConfig";
import IVRConfig from "./ivr/IVRConfig.vue";
export default {
  components: {
    PhoneNumberConfig,
    InboundCallConfig,
    IVRConfig
    // PhoneOutlined
  },
  computed: {
    gridSize() {
      return "grid-template-columns: repeat(4, 1fr)";
    },
  },
  methods: {
    callback(key) {
      console.log(key);
    },
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 10px;
  /* background-color: #2196F3; */
  padding: 5px;
}

.grid-container > div {
  background-color: #2196f3;
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
}
.call-config {
  /* text-align: left; */
  display: flex;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
</style>
