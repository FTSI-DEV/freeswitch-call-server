<template>
  <div>
    <a-menu  mode="horizontal" theme="dark">
      <li style="padding: 0px 20px">
        <span style="font-size: 1.3em">FREESWITCH</span>
      </li>
    </a-menu>
             <router-view></router-view>
    <!-- <div>
      <div style="display: flex">
        <div style="width: 80px">
          <a-menu
            class="menu-style"
            style="height: 100%"
            mode="inline"
            theme="dark"
            :inline-collapsed="true"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
          >
            <a-menu-item key="1" @click="setCurrentCompnent('Home')">
              <template #icon>
                <HomeOutlined />
              </template>
              <span>Home</span>
            </a-menu-item>
            <a-menu-item key="3" @click="setCurrentCompnent('InboundCallConfig')">
              <template #icon>
                <PhoneOutlined />
              </template>
              <span>Inbound Call Config</span>
            </a-menu-item>
            <a-menu-item key="4" @click="setCurrentCompnent('PhoneNumberConfig')">
              <template #icon>
                <SettingOutlined />
              </template>
              <span>Phone Number Config</span>
            </a-menu-item>
              <a-menu-item key="5" @click="setCurrentCompnent('CallDetailRecords')">
                <template #icon>
                  <SettingOutlined />
                </template>
                <span>Call Detail Records</span>
              </a-menu-item>
              <a-menu-item key="6" @click="setCurrentCompnent('CallRecording')">
                <template #icon>
                  <SettingOutlined />
                </template>
                <span>Call Recording</span>
              </a-menu-item>
          </a-menu>
        </div>
        <div style="flex: 1">
          <router-view></router-view>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
// import PhoneNumberConfig from "./phoneNumberConfig/PhoneNumberConfig.vue";
// import Home from './Home.vue';
// import ClickToCall from "./clickToCall/ClickToCall.vue";
// import InboundCallConfig from "./inboundCallConfig/InboundCallConfig.vue";
// import CallDetailRecords from "./callDetailRecords/CallDetailRecords.vue";
// import CallRecording from "./callRecording/CallRecording.vue";
import { useRouter } from "vue-router";
import { 
  defineComponent, 
  reactive, 
  toRefs, 
  watch 
} from "vue";
// import {
//   HomeOutlined,
//   NumberOutlined,
//   PhoneOutlined,
//   SettingOutlined,
// } from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive({
      collapsed: false,
      selectedKeys: ["1"],
      openKeys: ["sub1"],
      preOpenKeys: ["sub1"],
      currentComponent: "Home",
    });
    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );
    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };
    const setCurrentCompnent = (component: string) => {
      if (component === 'Home') {
         router.push({ path: "/" })
      }
    };

    return {
      ...toRefs(state),
      toggleCollapsed,
      setCurrentCompnent,
    };
  },
  components: {
    // PhoneNumberConfig,
    // HomeOutlined,
    // NumberOutlined,
    // PhoneOutlined,
    // SettingOutlined,
    // ClickToCall,
    // InboundCallConfig,
    // Home,
    // CallDetailRecords,
    // CallRecording,
  },
});
</script>
<style scoped>
.menu-style {
  height: 100vh;
  position: fixed;
}
</style>