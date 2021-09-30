<template>
  <a-layout>
    <div style="background: white; padding: 20px; padding-top: 0">
      <a-row>
        <a-col :span="12">
          <a-form :model="formState" :layout="'vertical'">
              <a-form-item label="IVR Script" style="margin-bottom: 10px">
            <a-input v-model:value="formState.ivrScript" />
          </a-form-item>
          <a-form-item label="Welcome Message" style="margin-bottom: 10px">
            <a-input v-model:value="formState.welcomeMessage" />
          </a-form-item>
          <a-form-item label="Welcome Record Url" style="margin-bottom: 10px">
            <a-input v-model:value="formState.welcomeRecordUrl" />
          </a-form-item>
          <a-form-item label="Failed Retry Message" style="margin-bottom: 10px">
            <a-input v-model:value="formState.failedRetryMessage" />
          </a-form-item>
          <a-form-item label="Failed Message" style="margin-bottom: 10px">
            <a-input v-model:value="formState.failedMessage" />
          </a-form-item>
          <a-form-item label="Redirect Call Message" style="margin-bottom: 10px">
            <a-input v-model:value="formState.redirectCallMessage" />
          </a-form-item>
          <a-form-item label="Pre-redirect Call Message" style="margin-bottom: 10px">
            <a-input v-model:value="formState.preRedirectCallMessage" />
          </a-form-item>
          <a-form-item label="Wrong Input Retry Message" style="margin-bottom: 10px">
            <a-input v-model:value="formState.wrongInputRetryMessage" />
          </a-form-item> 
          <a-form-item label="IVR Retry Count" style="margin-bottom: 15px">
            <a-input v-model:value="formState.ivrRetryCount" />
          </a-form-item>
          <div style="display: flex">
            <a-button type="primary" @click="saveIVRConfig">Save</a-button>
          </div>
          </a-form>
        </a-col>
      </a-row>

    </div>
  </a-layout>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, UnwrapRef } from "vue";
import { useStore } from 'vuex';
interface FormState {
    layout: "horizontal" | "vertical" | "inline";
    fieldA: string;
    fieldB: string;
    ivrScript: string;
    welcomeMessage: string;
    welcomeRecordUrl: string;
    failedRetryMessage: string;
    failedMessage: string;
    redirectCallMessage: string;
    preRedirectCallMessage: string;
    wrongInputRetryMessage: string;
    ivrRetryCount: string;
}
export default defineComponent({
  setup() {
    const store = useStore();
    const formState:UnwrapRef<FormState> = reactive({
      layout: "horizontal",
      fieldA: "",
      fieldB: "",
      ivrScript: "wew",
      welcomeMessage: "",
      welcomeRecordUrl: "",
      failedRetryMessage: "",
      failedMessage: "",
      redirectCallMessage: "",
      preRedirectCallMessage: "",
      wrongInputRetryMessage: "",
      ivrRetryCount: "",
    });
    const formItemLayout = computed(() => {
      const { layout } = formState;
      return layout === "horizontal"
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : {};
    });
    const buttonItemLayout = computed(() => {
      const { layout } = formState;
      return layout === "horizontal"
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : {};
    });
    const saveIVRConfig = () => {
      console.log("formState: ",  formState);
      store.dispatch('saveIVRConfig');
    };
    return {
      formState,
      formItemLayout,
      buttonItemLayout,
      saveIVRConfig,
    };
  },
});
</script>