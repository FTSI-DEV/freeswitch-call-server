<template>
  <a-layout>
    <div class="grid-container" style="padding: 0px 10px 10px 0px">
      <div class="item1 stat-item">
        <div style="flex: 1">
          <div class="stat-label">Phone Numbers</div>
          <div class="stat-value">50</div>
        </div>
        <div class="stat-icon-container">
          <PhoneFilled class="stat-icon" />
        </div>
      </div>
      <div class="item2 stat-item">
        <div style="flex: 1">
          <div class="stat-label">Call logs</div>
          <div class="stat-value">100</div>
        </div>
        <div class="stat-icon-container">
          <PhoneFilled class="stat-icon" />
        </div>
      </div>
      <div class="item3 stat-item">
        <div style="flex: 1">
          <div class="stat-label">Recordings</div>
          <div class="stat-value">100</div>
        </div>
        <div class="stat-icon-container">
          <PhoneFilled class="stat-icon" />
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="modeVisibility"
      title="Click To Call"
      ok-text="Call"
      @ok="clickToCall"
    >
      <ClickToCall ref="childRef" />
    </a-modal>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
        fontSize: '1.3em',
      }"
    >
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from "vue";
import ClickToCall from "./clickToCall/ClickToCall.vue";
import { useRouter } from "vue-router";
import { PhoneFilled } from "@ant-design/icons-vue";
export default defineComponent({
  components: { ClickToCall, PhoneFilled },
  setup() {
    const router = useRouter();
    const state = reactive({
      modeVisibility: false,
    });
    const childRef = ref<InstanceType<typeof ClickToCall>>();
    const openClickToCall = () => (state.modeVisibility = true);
    const clickToCall = () => {
      childRef.value?.clickToCall();
    };
    const openConfig = () => {
      router.push({ path: "call-config" });
    };
    const openCallRecording = () => {
      router.push({ path: "call-recording" });
    };
    return {
      ...toRefs(state),
      openClickToCall,
      clickToCall,
      childRef,
      openConfig,
      openCallRecording,
    };
  },
});
</script>
<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
.grid-container {
  display: grid;
  grid-template-columns: 250px 250px 250px;
  grid-gap: 10px;
  /* background-color: #2196F3; */
  padding: 5px;
}

.grid-container > div {
  padding: 10px 0px;
}
.item1 {
  /* background: #f8485e;
  color: #eee; */
  border-radius: 5px;
}

.item2 {
  /* background: #889eaf;
  color: #eee; */
  border-radius: 5px;
}

.item3 {
  /* background: #297f87;
  color: #eee; */
  border-radius: 5px;
}

.stat-item {
  box-shadow: 1px 1px 15px #dfdfdf;
  background: white;
  display: flex;
}
.stat-label {
  text-align: left;
  padding-left: 10px;
  color: #a5a5a5;
}
.stat-value {
  font-size: 3em;
  font-weight: 700;
  text-align: left;
  padding-left: 10px;
}
.stat-icon-container {
  width: 80px;
}
.stat-icon {
  font-size: 3em;
  margin-top: 30px;
  padding: 10px;
  background: #d1d1d157;
  border-radius: 30px;
}
</style>