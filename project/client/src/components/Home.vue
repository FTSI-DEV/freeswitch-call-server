<template>
  <a-layout>
    <a-layout style="padding: 24px 24px 24px">
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          margin: 0,
          minHeight: '280px',
          fontSize: '1.3em'
        }"
      >
        Weclome to freeswitch
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from 'vuex';
export default defineComponent({
  setup() {
    const store = useStore();
    return {
      selectedKeys1: ref<string[]>(["2"]),
      selectedKeys2: ref<string[]>(["1"]),
      collapsed: ref<boolean>(false),
      openKeys: ref<string[]>(["sub1"]),
      store,
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
</style>