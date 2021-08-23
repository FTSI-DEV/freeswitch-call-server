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
              <span>Option 1</span>
            </a-menu-item>
            <a-menu-item key="2" @click="setCurrentCompnent('OutboundCall')">
              <template #icon>
                <NumberOutlined />
              </template>
              <span>Option 3</span>
            </a-menu-item>
            <a-menu-item key="3" @click="setCurrentCompnent('InboundCall')">
              <template #icon>
                <PhoneOutlined />
              </template>
              <span>Option 3</span>
            </a-menu-item>
            <a-menu-item key="4" @click="setCurrentCompnent('Config')">
              <template #icon>
                <SettingOutlined />
              </template>
              <span>Option 3</span>
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
const routes = [
  {
    path: "index",
    breadcrumbName: "First-level Menu",
  },
  {
    path: "first",
    breadcrumbName: "Second-level Menu",
  },
  {
    path: "second",
    breadcrumbName: "Third-level Menu",
  },
];
import { defineComponent, reactive, toRefs, watch } from "vue";
import {
  // MenuUnfoldOutlined,
  HomeOutlined,
  // UserOutlined,
  // DesktopOutlined,
  NumberOutlined,
  // AppstoreOutlined,
  PhoneOutlined,
  SettingOutlined,
  //  FileTextOutlined
} from "@ant-design/icons-vue";
import Config from "./Config.vue";
import Home from './Home.vue';
import OutboundCall from "./OutboundCall.vue";
import InboundCall from "./InboundCall.vue";
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
      routes,
    };
  },
  components: {
    Config,
    HomeOutlined,
    // UserOutlined,
    // DesktopOutlined,
    NumberOutlined,
    // AppstoreOutlined,
    PhoneOutlined,
    SettingOutlined,
    OutboundCall,
    InboundCall,
    Home
    //  FileTextOutlined
  },
});
</script>
<style scoped>
.menu-style {
  height: 100vh;
  position: fixed;
}
</style>