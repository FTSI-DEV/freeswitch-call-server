<template>
  <a-layout style="padding: 24px">
    <!-- <div style="padding: 10px; text-align: left; fontSize: 1.5em">
      Freeswitch
    </div> -->
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '1.3em',
      }"
    >
      <div class="grid-container">
        <div class="item1" @click="openClickToCall">
          <PhoneFilled style="font" :style="{ fontSize: '30px' }" />
          <div>Click To Call</div>
        </div>
         <div class="item2" @click="openConfig">
         <SettingFilled style="font" :style="{ fontSize: '30px' }" />
          <div>Call Config</div>
        </div>
        <div class="item3" @click="openCallRecording">
         <PlayCircleFilled style="font" :style="{ fontSize: '30px' }" />
          <div>Call Recording</div>
        </div>
      </div>
      <a-modal
          v-model:visible="modeVisibility"
          title="Click To Call"
          ok-text="Call"
          @ok="clickToCall"
        >
          <ClickToCall ref="childRef"/>
      </a-modal>
    </a-layout-content>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
        fontSize: '1.3em',
      }"
    >
      <CallDetailRecords />
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from "vue";
import { useStore } from "vuex";
import CallDetailRecords from "./callDetailRecords/CallDetailRecords.vue";
import { PhoneFilled, SettingFilled, PlayCircleFilled } from "@ant-design/icons-vue";
import ClickToCall from "./clickToCall/ClickToCall.vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { CallDetailRecords, PhoneFilled, ClickToCall, SettingFilled, PlayCircleFilled},
  setup() {
     const router = useRouter()
    const state = reactive({
      modeVisibility: false
    });
    const childRef = ref<InstanceType<typeof ClickToCall>>()
    const openClickToCall = () => state.modeVisibility = true;
    const clickToCall = () => {
      childRef.value?.clickToCall()
    }
    const openConfig = () => {
      router.push({ path: "call-config" });
    }
    const openCallRecording = () => {
      router.push({ path: "call-recording" });
    }
    return {
      ...toRefs(state),
      openClickToCall,
      clickToCall,
      childRef,
      openConfig,
      openCallRecording
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
  grid-template-columns: 200px 200px 200px;
  grid-gap: 10px;
  /* background-color: #2196F3; */
  padding: 5px;
}

.grid-container > div {
  text-align: center;
  padding: 18px 0px;
}
.item1 {
  background: #F8485E;
  color: #eee;
  cursor: pointer;
  border-radius: 5px;
}
.item1:hover {
  box-shadow: 1px 1px 15px #a8a8a8;
  border-radius: 5px;
}
.item2 {
  background: #889EAF;
  color: #eee;
  cursor: pointer;
  border-radius: 5px;
}
.item2:hover {
  box-shadow: 1px 1px 15px #a8a8a8;
  border-radius: 5px;
}
.item3 {
  background: #297F87;
  color: #eee;
  cursor: pointer;
  border-radius: 5px;
}
.item3:hover {
  box-shadow: 1px 1px 15px #a8a8a8;
  border-radius: 5px;
}
</style>