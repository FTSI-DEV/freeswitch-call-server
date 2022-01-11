<template>
  <div style="background: white">
    <div class="account-config">
      <span @click="backToList"> <ArrowLeftOutlined /> Back </span>
    </div>
    <a-alert
      v-if="isSaved && !hasError"
      message="Successfully saved"
      type="success"
      style="text-align: left; margin-bottom: 5px"
    />
    <a-aler
      v-if="isServerError"
      message="Error"
      type="error"
      style="text-align: left; margin-bottom: 5px"
    />
    <a-row>
      <a-col :span="12" style="margin-right: 15px">
        <a-form-item label="Call Types" style="display: block; text-align: left">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="setCallType('ivr')"> IVR </a-menu-item>
                <a-menu-item key="2" @click="setCallType('inbound')">
                  Inbound</a-menu-item
                >
              </a-menu>
            </template>
            <a-button style="width: 100%; text-align: left">
              {{ selectedCallType }}
              <DownOutlined style="float: right; margin-top: 5px" />
            </a-button>
          </a-dropdown>
        </a-form-item>
        <a-form-item label="Account Id" style="display: block; text-align: left">
          <input :class="['ant-input', isInvalid(accountId)]" v-model="accountId" />
        </a-form-item>
        <a-form-item label="Caller Id" style="display: block; text-align: left">
          <input :class="['ant-input', isInvalid(callerId)]" v-model="callerId" />
        </a-form-item>
        <a-form-item label="HTTP Method" style="display: block; text-align: left">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="setMethod('POST')"> HTTP POST </a-menu-item>
                <a-menu-item key="2" @click="setMethod('GET')"> HTTP GET </a-menu-item>
              </a-menu>
            </template>
            <a-button style="width: 100%; text-align: left">
              {{ selectedHttpMethod }}
              <DownOutlined style="float: right; margin-top: 5px" />
            </a-button>
          </a-dropdown>
        </a-form-item>
        <a-form-item label="Webhook Url" style="display: block; text-align: left">
          <input :class="['ant-input', isInvalid(webhookUrl)]" v-model="webhookUrl" />
        </a-form-item>
        <a-form-item style="text-align: left">
          <a-button type="primary" @click="saveConfig" style="margin-top: 32px">
            Save
          </a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import methodsObj from "./helper/methods";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    ArrowLeftOutlined,
  },
  setup(props, { emit }) {
    console.log("props: ", props);
    const {
      state,
      isInvalid,
      saveConfig,
      setMethod,
      selectedHttpMethod,
      setCallType,
      selectedCallType,
    } = methodsObj();
    const backToList = () => {
      emit("backToList");
      console.log("backToList");
    };

    return {
      ...toRefs(state),
      selectedHttpMethod,
      isInvalid,
      saveConfig,
      setMethod,
      backToList,
      setCallType,
      selectedCallType,
    };
  },
});
</script>
<style scoped>
.call-config {
  text-align: left;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.invalid {
  border: 1px solid red;
}
.account-config {
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
  padding-bottom: 5px;
  color: #1890ff;
}
</style>
