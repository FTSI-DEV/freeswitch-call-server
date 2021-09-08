<template>
  <div>
    <a-menu  mode="horizontal" theme="dark">
      <li style="padding: 0px 20px">
        <span style="font-size: 1.3em">FREESWITCH</span>
      </li>
    </a-menu>
    <div>
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
            <a-menu-item key="2" @click="setCurrentCompnent('ClickToCall')">
              <template #icon>
                <NumberOutlined />
              </template>
              <span>Click To Call</span>
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
          </a-menu>
        </div>
        <div style="flex: 1">
          <component :is="currentComponent" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import PhoneNumberConfig from "./phoneNumberConfig/PhoneNumberConfig.vue";
import Home from './Home.vue';
import ClickToCall from "./clickToCall/ClickToCall.vue";
import InboundCallConfig from "./inboundCallConfig/InboundCallConfig.vue";
import { 
  defineComponent, 
  reactive, 
  toRefs, 
  watch 
} from "vue";
import {
  HomeOutlined,
  NumberOutlined,
  PhoneOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
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
      state.currentComponent = component;
    };

    return {
      ...toRefs(state),
      toggleCollapsed,
      setCurrentCompnent,
    };
  },
  components: {
    PhoneNumberConfig,
    HomeOutlined,
    NumberOutlined,
    PhoneOutlined,
    SettingOutlined,
    ClickToCall,
    InboundCallConfig,
    Home
  },
});
</script>
<style scoped>
.menu-style {
  height: 100vh;
  position: fixed;
}
</style>