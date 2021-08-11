<template>
  <div>
    <a-menu v-model:selectedKeys="current" mode="horizontal" theme="dark">
      <a-menu-item key="mail">
         <span style="font-size: 1.3em">FREESWITCH</span>
      </a-menu-item>
      <a-menu-item key="number">
        <template #icon>
          <phone-outlined />
        </template> Phone Numbers
      </a-menu-item>
           <a-menu-item key="log" >
        <template #icon>
          <FileTextOutlined />
        </template> Call Log
      </a-menu-item>
      <a-menu-item key="alipay">
        <a href="https://antdv.com" target="_blank" rel="noopener noreferrer"> Navigation Four - Link </a>
      </a-menu-item>
    </a-menu>
    <div>
      <!-- <a-button type="primary" @click="toggleCollapsed" style="margin-bottom: 16px">
      <MenuUnfoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
    </a-button> -->
    <a-row style="background: gainsboro">
      <a-col :span="1">
          <a-menu class="menu-style" style="height: 100%" mode="inline" theme="dark" :inline-collapsed="true" v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys">
        <a-menu-item key="1">
          <template #icon>
            <HomeOutlined />
          </template>
          <span>Option 1</span>
        </a-menu-item>
        <a-menu-item key="3">
          <template #icon>
            <NumberOutlined />
          </template>
          <span>Option 3</span>
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon>
            <DesktopOutlined />
          </template>
          <span>Option 2</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #icon>
            <UserOutlined />
          </template>
          <template #title>Navigation One</template>
          <a-menu-item key="5">Option 5</a-menu-item>
          <a-menu-item key="6">Option 6</a-menu-item>
          <a-menu-item key="7">Option 7</a-menu-item>
          <a-menu-item key="8">Option 8</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #icon>
            <AppstoreOutlined />
          </template>
          <template #title>Navigation Two</template>
          <a-menu-item key="9">Option 9</a-menu-item>
          <a-menu-item key="10">Option 10</a-menu-item>
          <a-sub-menu key="sub3" title="Submenu">
            <a-menu-item key="11">Option 11</a-menu-item>
            <a-menu-item key="12">Option 12</a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
      </a-menu>
      </a-col>
      <a-col :span="23">
          <div style="height: 95vh">
            <a-breadcrumb style="text-align: left; padding: 10px 10px">
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
    <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
    <a-breadcrumb-item>An Application</a-breadcrumb-item>
  </a-breadcrumb>
  <div>
    <label for="">Phone Numbers</label>
  </div>
          </div>
      </a-col>
    </a-row>
     
    </div>
  </div>
</template>
<script lang="ts">
  const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  },
  {
    path: 'first',
    breadcrumbName: 'Second-level Menu',
  },
  {
    path: 'second',
    breadcrumbName: 'Third-level Menu',
  },
];
  import { defineComponent, reactive, toRefs, watch } from 'vue';
  import {
    // MenuUnfoldOutlined,
    HomeOutlined,
    UserOutlined,
    DesktopOutlined,
    NumberOutlined,
    AppstoreOutlined,
     PhoneOutlined,
     FileTextOutlined
  } from '@ant-design/icons-vue';
  export default defineComponent({
    setup() {
      const state = reactive({
        collapsed: false,
        selectedKeys: ['1'],
        openKeys: ['sub1'],
        preOpenKeys: ['sub1'],
      });

      watch(
        () => state.openKeys,
        (val, oldVal) => {
          state.preOpenKeys = oldVal;
        },
      );
      const toggleCollapsed = () => {
        state.collapsed = !state.collapsed;
        state.openKeys = state.collapsed ? [] : state.preOpenKeys;
      };

      return {
        ...toRefs(state),
        toggleCollapsed,
          routes,
      };
    },
    components: {
      HomeOutlined,
      UserOutlined,
      DesktopOutlined,
      NumberOutlined,
      AppstoreOutlined,
       PhoneOutlined,
       FileTextOutlined
    },
  });
</script>
<style scoped>
  .menu-style {
    height: 100vh;
    position: fixed;
  }
</style>