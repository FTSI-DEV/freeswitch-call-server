<template>
  <a-layout>
    <div style="background: white; padding: 20px; padding-top: 0">
      <div class="account-config" v-if="currentComponent === 'InboundCallConfig'">
        Config List
        <PlusSquareFilled
          style="color: #57cc99; cursor: pointer; margin-left: 6px"
          @click="addInboundConfig"
          title="Add Account Config"
        />
      </div>
      <component :is="currentComponent" @backToList="backToList" />
    </div>
  </a-layout>
</template>

<script lang="ts">
import InboundCallConfig from "./InboundCallConfig.vue";
import AddInboundConfig from "./AddInboundConfig.vue";
import { PlusSquareFilled } from "@ant-design/icons-vue";
import { defineComponent, toRefs, reactive } from "vue";

export default defineComponent({
  components: { InboundCallConfig, PlusSquareFilled, AddInboundConfig },
  setup() {
    const state = reactive({
      currentComponent: "AddInboundConfig",
    });
    const backToList = () => {
      state.currentComponent = "InboundCallConfig";
    };
    const addInboundConfig = () => {
      state.currentComponent = "AddInboundConfig";
      console.log("addInboundConfig");
    };

    return {
      ...toRefs(state),
      backToList,
      addInboundConfig,
    };
  },
});
</script>

<style scoped>
.account-config {
  text-align: left;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
</style>
